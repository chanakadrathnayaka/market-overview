const options = {
  openapi: 'OpenAPI 3',
}

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Market Overview API',
    description: 'APIs for Market Overview web application',
    contact: {
      'name': 'Chanaka Rathnayaka',
      'email': 'talktochanaka@gmail.com'
    },
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './docs/swagger.json';
const endpointsFiles = ['./app.ts', './controllers/*.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
