import express, {Router} from 'express';
import {SymbolController} from "../controllers/symbol.controller";

const router: Router = express.Router();

router.get('/quotes/:symbol', SymbolController.quote);
router.get('/search', SymbolController.search);
router.get('/intraday/:symbol', SymbolController.intraday);

export const symbolRouter = router;
