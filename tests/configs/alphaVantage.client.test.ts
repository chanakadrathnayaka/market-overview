import {RequestOptions} from 'http';
import * as https from 'https';
import {AlphaAdvantageClient} from "../../src/configs/alphaVantage.client";
import {IncomingMessage} from "node:http";

jest.mock('http');
jest.mock('https');

const mockedHttps = https as jest.Mocked<typeof https>;

describe('AlphaAdvantageClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // clear cache
    process.env = {...originalEnv}; // make a copy
  });

  afterAll(() => {
    process.env = originalEnv; // restore original environment
  });

  it('should make a request and resolve with data', async () => {
    process.env.ALPHA_VANTAGE_API_KEY = 'dummy-key';

    const mockResponse = {
      setEncoding: jest.fn(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('some data');
        } else if (event === 'end') {
          callback();
        }
      }),
    };

    const mockRequest = {
      on: jest.fn(),
      end: jest.fn(),
    };

    mockedHttps.request.mockImplementation((url: string | URL, options: RequestOptions, callback?: ((res: IncomingMessage) => void)) => {
      if (callback) {
        callback(mockResponse as any);
      }
      return mockRequest as any;
    });

    const data = await AlphaAdvantageClient.get('TIME_SERIES_INTRADAY', 'AAPL');

    expect(mockedHttps.request).toHaveBeenCalled();
    expect(mockedHttps.request).toHaveBeenCalledTimes(1);
    expect(data).toBe('some data');
  });

  it('should reject if response contains "Thank you for using Alpha Vantage"', async () => {
    process.env.ALPHA_VANTAGE_API_KEY = 'dummy-key';

    const mockResponse = {
      setEncoding: jest.fn(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback('Thank you for using Alpha Vantage');
        } else if (event === 'end') {
          callback();
        }
      }),
    };

    const mockRequest = {
      on: jest.fn(),
      end: jest.fn(),
    };

    mockedHttps.request.mockImplementation((url: string | URL, options: RequestOptions, callback?: ((res: IncomingMessage) => void)) => {
      if (callback) {
        callback(mockResponse as any);
      }
      return mockRequest as any;
    });

    await expect(AlphaAdvantageClient.get('TIME_SERIES_INTRADAY', 'AAPL')).rejects.toBe('Thank you for using Alpha Vantage');

    expect(mockedHttps.request).toHaveBeenCalled();
  });

  it('should reject on request error', async () => {
    process.env.ALPHA_VANTAGE_API_KEY = 'dummy-key';

    const mockRequest = {
      on: jest.fn((event, callback) => {
        if (event === 'error') {
          callback(new Error('Network error'));
        }
      }),
      end: jest.fn(),
    };

    mockedHttps.request.mockImplementation(() => {
      return mockRequest as any;
    });

    await expect(AlphaAdvantageClient.get('TIME_SERIES_INTRADAY', 'AAPL')).rejects.toThrow('Network error');

    expect(mockedHttps.request).toHaveBeenCalled();
  });
});
