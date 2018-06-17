import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const client = new ApolloClient({
  uri: 'https://inanium-engine.glitch.me/graphql'
});

client.query({
  query: gql`
    query blogEntries {
      person(handle:"buckelij"){
        blog{
          blogEntriesConnection(first: 3, after: null){
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges{
              node{
                date
                body
              }
              cursor
            }
          }
        }
      }
    }
  `,
})
  .then(data => {console.log(data); document.body.innerHTML = JSON.stringify(data)})
  .catch(error => console.log(error));
