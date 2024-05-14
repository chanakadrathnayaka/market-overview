import * as http from "http";
import {RequestOptions} from "http";

var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&=demo';

const defaultOptions: RequestOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

interface AVRequestOptions {
  outputsize?: 'compact' | 'full';
  interval?: '1min' | '5min' | '15min' | '30min' | '60min';
}

type AVFunction = 'TIME_SERIES_INTRADAY';

const request = (fn: AVFunction, symbol: string, requestOptions: RequestOptions, queryOptions?: AVRequestOptions) => {
  const queryString = getQueryString({
    ...queryOptions,
    'function': fn,
    symbol,
    apikey: process.env.ALPHA_VANTAGE_API_KEY
  });

  return new Promise((resolve, reject) => {
    let data = '';
    // `https://www.alphavantage.co/query?${queryString}`
    const request = http.request('http://localhost:3032/intraday', requestOptions, (response) => {
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => resolve(data));
    });

    request.on('error', (error: Error) => reject(error));

    request.end();
  });
};

const getQueryString = (queryParams: { [key: string]: string | number | undefined }) => {
  let queryString = '';
  let joiner = '';
  for (const queryParamsKey in queryParams) {
    queryString += `${joiner}${queryParamsKey}=${queryParams[queryParamsKey]}`;
    joiner = '&';
  }

  return queryString;
}

const get = (fn: AVFunction, symbol: string, options?: AVRequestOptions) => {
  return request(fn, symbol, {...defaultOptions, method: 'GET'}, options);
}

export const AlphaAdvantageClient = {get}
