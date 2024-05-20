import * as finnhub from 'finnhub';
import {FinnHub} from "../../src/configs/finnhub.config";

jest.mock('finnhub');

const mockedFinnhub = finnhub as jest.Mocked<typeof finnhub>;

describe('FinnHub Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // clear cache
    process.env = {...originalEnv}; // make a copy
    mockedFinnhub.ApiClient.instance = {
      authentications: {
        'api_key': {apiKey: ''}
      }
    } as any;
  });

  afterAll(() => {
    process.env = originalEnv; // restore original environment
  });

  it('should register finnhub client with API key', () => {
    process.env.FINNHUB_API_KEY = 'test-api-key';

    FinnHub.register();

    expect(mockedFinnhub.ApiClient.instance.authentications['api_key'].apiKey).toBe('test-api-key');
    expect(mockedFinnhub.DefaultApi).toHaveBeenCalled();
  });

  it('should return finnhub client if registered', () => {
    process.env.FINNHUB_API_KEY = 'test-api-key';
    FinnHub.register();
    const client = FinnHub.getClient();
    expect(client).toBeInstanceOf(mockedFinnhub.DefaultApi);
  });
});
