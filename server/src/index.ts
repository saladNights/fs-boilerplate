import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';

(async () => {
  const app = express();

  const apolloServer = new ApolloServer({
	  schema: await buildSchema({
		  resolvers: [UserResolver]
	  })
  });

  apolloServer.applyMiddleware({ app });

	app.get('/', (_req, res) => res.send('hello'));
	app.listen(4000, () => {
		console.log('express server started');
	});
})();
