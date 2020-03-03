import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';
import {createConnection} from 'typeorm';
import cookieParser from 'cookie-parser';

(async () => {
  const app = express();
  app.use(cookieParser());

  app.post('/refresh_token', req => {
	  console.log(req.cookies);
  });

	await createConnection();

  const apolloServer = new ApolloServer({
	  schema: await buildSchema({
		  resolvers: [UserResolver]
	  }),
	  context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app });

	app.get('/', (_req, res) => res.send('hello'));
	app.listen(4000, () => {
		console.log('express server started');
	});
})();
