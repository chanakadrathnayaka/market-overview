import express, {Router} from 'express';
import {SymbolController} from "../services/symbol.controller";

const router: Router = express.Router();

router.get('/quotes/:symbol', SymbolController.quote);
router.get('/intraday/:symbol', SymbolController.intraday);

export const symbolRouter = router;
