import {Request, Response} from "express";
import {FinnHub} from "../configs/finnhub.config";

const marketStatus = (req: Request, res: Response) => {
  console.log(req.params.market)
  FinnHub.getClient().marketStatus(req.params.market, (error: any, data: any, response: any) => {
    console.log(data);
    console.error(error);
    res.send(data);
  });
};

export const ExchangeController = {marketStatus};
