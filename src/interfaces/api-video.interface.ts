export interface Creative {
  type: string;
  url: string;
  time: number;
  skip: number;
  start: number;
  stop: number;
  mode: string;
  no_fallback: number;
}

export interface Adv {
  content_id: string;
  creatives: Creative[];
}

export interface Security {
  allowed_countries: string[];
  country: string;
  allowedFromReferer: boolean;
}

export interface Medium {
  quality: string;
  url: string;
  type: string;
}

export interface Video {
  vcmsId: number;
  hash: string;
  channel: string;
  channel_domain: string;
  project_id: string;
  projectName: string;
  seasonName: string;
  releaseName: string;
  year_of_production: number;
  countries_of_production: string[];
  content_language: string[];
  publishDate: string;
  date_of_broadcast: string;
  time_upload_video: string;
  cache_time: string;
  current_time: string;
  videoAccessible: boolean;
  videoAccessible_type: string;
  autoplay: boolean;
  showadv: boolean;
  anons: boolean;
  program: string;
  name: string;
  duration: number;
  poster: string;
  projectPostURL: string;
  preview_url: string;
  tt: string;
  canonicalPageUrl: string;
  adv: Adv;
  security: Security;
  media: Medium[];
  mediaHls: string;
  mediaHlsNoAdv: string;
}

export interface IApiVideo {
  version: string;
  type: string;
  poster: string;
  name: string;
  video: Video[];
}
