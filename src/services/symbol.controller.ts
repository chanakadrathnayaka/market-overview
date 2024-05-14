import {FinnHub} from "../configs/finnhub.config";
import {Request, Response} from "express";
import {AlphaAdvantageClient} from "../configs/alphaVantage.client";

const quote = (req: Request, res: Response) => {
  FinnHub.getClient().quote(req.params.symbol, (error: any, data: any, response: any) => {
    res.send(data);
  });
};

const intraday = (req: Request, res: Response) => {
  AlphaAdvantageClient.get('TIME_SERIES_INTRADAY', req.params.symbol, {interval: "5min"})
  .then(data => res.contentType('application/json').send(data))
};
export const SymbolController = {quote, intraday};
