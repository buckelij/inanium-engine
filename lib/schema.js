import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  testString: String
  person(handle: String): Person
}

type Person {
  id: Int
  firstName: String
  lastName: String
  handle: String
  emails: [String]
  github: String
  resume: Resume
  blog: Blog
}

type Resume {
  id: Int
  person: Person
  body: String
}

type Blog {
  id: Int
  title: String
  tagline: String
  entries: [BlogEntry]
}

type BlogEntry {
  id: Int
  date: Int
  title: String
  body: String
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
