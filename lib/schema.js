const { gql } = require('apollo-server');
import resolvers from './resolvers';

const typeDefs = gql`
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
  body: String
}

type Blog {
  id: Int
  title: String
  tagline: String
  blogEntriesConnection(first: Int,
                        after: String,
                        last: Int,
                        before: String
  ): BlogEntriesConnection
}

type BlogEntriesConnection {
  pageInfo: PageInfo!
  edges: [BlogEntriesEdge]
}

type BlogEntriesEdge {
  cursor: String!
  node: BlogEntry
}

type BlogEntry {
  date: String
  body: String
}

type PageInfo{
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor: String
  endCursor: String
}
`;

export { typeDefs, resolvers }
