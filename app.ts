import cors from 'cors';
import express, {Express, NextFunction, Request, Response} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import dotenv from 'dotenv';
import {FinnHub} from "./src/configs/finnhub.config";
import indexRouter from './src/routes/index.router';
import {usersRouter} from './src/routes/users.router';
import {symbolRouter} from "./src/routes/symbol.router";
import {exchangeRouter} from "./src/routes/exchange.router";
import * as mongoose from "mongoose";
import {TradeWS} from "./src/wsserver/trade.wss";
import swaggerUi from 'swagger-ui-express';
// @ts-ignore This is an auto generated file
import swaggerDocument from './docs/swagger.json';

dotenv.config();

const app: Express = express();
const mongoDBUri = process.env.MONGO_DB_URI;

// live reload
if (process.env.NODE_ENV === 'development') {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
  app.use(cors());
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/symbol', symbolRouter);
app.use('/exchange', exchangeRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true
}));

mongoose.connect(mongoDBUri!)
.then(() => {
  console.log("MongoDB database connection established successfully");
})
.catch((err: any) => {
  console.error(err);
});

// catch 404 and forward to home page
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.redirect('/')
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
