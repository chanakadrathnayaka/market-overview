export interface AVRequestOptions {
  outputsize?: 'compact' | 'full';
  interval?: AVInterval;
}

export type AVFunction = 'TIME_SERIES_INTRADAY';
export type AVInterval = '1min' | '5min' | '15min' | '30min' | '60min';
