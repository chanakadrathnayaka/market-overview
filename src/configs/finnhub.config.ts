import * as finnhub from 'finnhub';
import {DefaultApi} from 'finnhub';

let finnhubClient: DefaultApi | null = null;
const register = () => {
  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  api_key.apiKey = process.env.FINNHUB_API_KEY;
  finnhubClient = new finnhub.DefaultApi();
}

const getClient = () => {
  if (finnhubClient) {
    return finnhubClient;
  } else {
    throw new Error('Finnhub client is not registered');
  }
}
export const FinnHub = {register, getClient};
