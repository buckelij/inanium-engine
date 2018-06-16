import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const client = new ApolloClient({
  uri: 'https://inanium-engine.glitch.me/graphql'
});

client.query({
  query: gql`
    query buckelij {
      person(handle: "buckelij"){
        id
      }
    }
  `,
})
  .then(data => {console.log(data); document.body.innerHTML = JSON.stringify(data)})
  .catch(error => console.log(error));


