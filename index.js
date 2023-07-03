const express = require('express');
const { graphqlHTTP: expressGraphQL } = require('express-graphql');
const schema = require('./src/controller');

const app = express();

app.use(
    '/graphql',
    expressGraphQL({
        schema: schema,
        graphiql: true,
    })
);

app.listen(8080, () => console.log('Server Running'));
