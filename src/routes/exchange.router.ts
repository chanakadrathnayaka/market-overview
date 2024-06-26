import express, {Router} from 'express';
import {ExchangeController} from "../controllers/exchange.controller";

const router: Router = express.Router();

router.get('/status/:market', ExchangeController.marketStatus);

export const exchangeRouter = router;
