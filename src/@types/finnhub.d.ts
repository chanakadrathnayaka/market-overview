declare module 'finnhub' {
  const ApiClient;

  class DefaultApi {
    quote(symbol: string, callback: CallBack);

    marketStatus(exchange: string, callback: CallBack);
  }
}
type CallBack = { (error: any, data: any, response: any): void }
