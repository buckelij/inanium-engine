const { ApolloServer } = require('apollo-server')
import { typeDefs, resolvers } from './lib/schema'

const graphQLServer = new ApolloServer({ typeDefs, resolvers })

graphQLServer.listen().then(({ url }) => {
  console.log(`ready at ${url}`);
})
