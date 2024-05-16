import * as https from "https";
import {RequestOptions} from "http";
import {AVFunction, AVRequestOptions} from "./alphaVantage.config";

const defaultOptions: RequestOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const request = (fn: AVFunction, symbol: string, requestOptions: RequestOptions, queryOptions?: AVRequestOptions) => {
  const queryString = getQueryString({
    ...queryOptions,
    'function': fn,
    symbol,
    apikey: process.env.ALPHA_VANTAGE_API_KEY
  });

  return new Promise((resolve, reject) => {
    let data = '';
    const request = https.request(`https://www.alphavantage.co/query?${queryString}`, requestOptions, (response) => {
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (data.toString().includes('Thank you for using Alpha Vantage')) {
          reject(data);
        } else {
          resolve(data);
        }
      });
    });

    request.on('error', (error: Error) => reject(error));

    request.end();
  });
};

const getQueryString = (queryParams: { [key: string]: unknown }) => {
  let queryString = '';
  let joiner = '';
  for (const queryParamsKey in queryParams) {
    if (queryParamsKey && queryParams[queryParamsKey] !== undefined) {
      queryString += `${joiner}${queryParamsKey}=${queryParams[queryParamsKey]}`;
      joiner = '&';
    }
  }

  return queryString;
}

const get = (fn: AVFunction, symbol: string, options?: AVRequestOptions) => {
  return request(fn, symbol, {...defaultOptions, method: 'GET'}, options);
}

export const AlphaAdvantageClient = {get}
