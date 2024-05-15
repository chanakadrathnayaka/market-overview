import createError from 'http-errors';
import express, {Express, NextFunction, Request, Response} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import dotenv from 'dotenv';
import {FinnHub} from "./src/configs/finnhub.config";

import indexRouter from './src/routes';
import {usersRouter} from './src/routes/users.router';
import {symbolRouter} from "./src/routes/symbol.router";
import {exchangeRouter} from "./src/routes/exchange.router";
import {TradeWS} from "./src/wsserver/trade.controller";

dotenv.config();

const app: Express = express();

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'pug');

// live reload
if (process.env.NODE_ENV === 'development') {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stocks', symbolRouter);
app.use('/exchange', exchangeRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

FinnHub.register();
TradeWS.register();

module.exports = app;
