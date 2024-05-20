import {Request, Response} from "express";
import {FinnHub} from "../configs/finnhub.config";

const marketStatus = (req: Request, res: Response) => {
  FinnHub.getClient().marketStatus(req.params.market, (error: any, data: any, response: any) => {
    res.send(data);
  });
};

export const ExchangeController = {marketStatus};
