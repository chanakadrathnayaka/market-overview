# Market Overview API

## Technologies

1. NodeJS / Express with TypeScript
2. Mongoose with Mongo DB

## API Documentation

Access swagger API documentation from [here](http://localhost:3000/api-docs/)

## Data Sources

The user should be aware of the number of API request restrictions as
this application heavily rely on them.

### 1. [Finnhub Stock API](https://finnhub.io)

Restriction: 25 API calls per hour.

#### REST Endpoints

1. `/symbol/quotes/{symbol}`
2. `/symbol/search`
3. `/exchange/status/{market}`

#### Web Socket Endpoint

1. `ws://localhost:3001/trade`

### 2. [Alpha Vantage](https://www.alphavantage.co)

Restriction: 25 API calls per day.

#### REST Endpoints

1. `/symbol/intraday/{symbol}`

## Further development

1. Redis Caching storages will be included to improve
   user convenience (The inconvenience causes by the number of API request restrictions)
2. OAuth2 login will be implemented (Google)
