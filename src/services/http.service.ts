import {Service} from 'typedi';
import axios, {Method} from 'axios';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';

@Service()
export class HttpService {

  get<T>(url: string): Observable<T> {
    return this._request('GET', url);
  }

  protected _request(method: Method, url: string, data: any = null): Observable<any> {
    return fromPromise(axios.request({
      method,
      url,
      data
    })).pipe(map(res => res.data))
  }
}
