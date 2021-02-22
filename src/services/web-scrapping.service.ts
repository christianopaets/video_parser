import {Service} from 'typedi';
import {HttpService} from './http.service';
import cheerio = require('cheerio');
import {catchError, map, switchMap} from 'rxjs/operators';
import {forkJoin, Observable, of} from 'rxjs';
import {Video} from '../entity/Video';
import {IApiVideo} from '../interfaces/api-video.interface';

@Service()
export class WebScrappingService {

  private readonly _url = 'https://www.stb.ua/masterchef/ua/';

  constructor(private readonly http: HttpService) {
  }

  getWebsiteData(): Observable<Video[]> {
    return this._getPageData(this._url)
      .pipe(switchMap(res => this.getNewVideosCard(res)))
      .pipe(map(res => this.getNewVideoObject(res)))
      .pipe(switchMap(list => this._scrapEachVideo(list)))
      .pipe(map(list => list.filter(video => video.url)));
  }

  getNewVideosCard(data: CheerioStatic): Observable<Cheerio> {
    return of(data)
      .pipe(map(res => res('div[data-collection="new_videos"] .preview-item')))
      .pipe(map(videos => {
        return videos.filter(index => {
          const page = cheerio(videos[index]);
          const allInfo = page.find('.category').text().split('|').length === 4;
          const partial = page.find('.title').text().match(/(Часть|Частина) \d+/);
          return allInfo || !!partial;
        });
      }));
  }

  getNewVideoObject(data: Cheerio): Video[] {
    const arr = [];
    data.each((index, element) => {
      const $ = cheerio(element);
      const title = $.find('.category').text().split('|').map(res => res.trim());
      const video = new Video();
      if (title.length === 4) {
        video.season = title[3];
        video.series = title[0];
        video.part = title[1];
        video.date = title[2];
      } else {
        video.season = title[2];
        video.series = title[0];
        video.part = $.find('.title').text().match(/(Часть|Частина) \d+/)[0];
        video.date = title[1];
      }
      video.link = $.find('.preview-link').attr('href');
      arr.push(video);
    });
    return arr;
  }

  private _getPageData(url: string): Observable<CheerioStatic> {
    return this.http.get<string>(url)
      .pipe(map(res => cheerio.load(res)));
  }

  protected _scrapEachVideo(list: Video[]): Observable<Video[]> {
    const array = list.map(item => {
      return of(item)
        .pipe(switchMap(item => this._getPageData(item.link)
          .pipe(switchMap(res => this._getVideoInfo(res, item)))
        ));
    })
    return forkJoin(array);
  }

  protected _getVideoInfo(data: CheerioStatic, video: Video): Observable<Video> {
    const link = new URL(data('iframe').attr('src'));
    const hash = link.searchParams.get('hash');
    const referer = video.link;
    // video.segmentsUrl = link.searchParams.get('file');
    return this.http.get<IApiVideo>(`https://vcms-api2.starlight.digital/player-api/${hash}?referer=${referer}`)
      .pipe(map(res => {
        video.thumbnail = res.poster;
        video.preview = res.poster;
        video.url = res.video[0].media.find(item => item.quality === 'mq').url;
        return video;
      })).pipe(catchError(err => {
        console.log(err, video);
        return of(video);
      }));
  }
}
