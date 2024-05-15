import {FinnHub} from "../configs/finnhub.config";
import {Request, Response} from "express";
import {AlphaAdvantageClient} from "../configs/alphaVantage.client";
import {AVInterval} from "../configs/alphaVantage.config";

const quote = (req: Request, res: Response) => {
  FinnHub.getClient().quote(req.params.symbol, (error: any, data: any, response: any) => {
    res.send(data);
  });
};

const search = (req: Request, res: Response) => {
  const symbol: string = req.query.symbol as string;
  if (symbol) {
    FinnHub.getClient().symbolSearch(symbol, (error: any, data: any, response: any) => {
      res.send(data);
    });
  } else {
    res.status(400).contentType('application/json').send('Invalid symbol');
  }
};

const intraday = (req: Request, res: Response) => {
  const interval: AVInterval = req.query.interval as AVInterval;

  AlphaAdvantageClient.get('TIME_SERIES_INTRADAY', req.params.symbol, {interval})
  .then(data => res
      .contentType('application/json')
      .send(data)
  ).catch(error => res.status(500).send(error))
};
export const SymbolController = {quote, search, intraday};
