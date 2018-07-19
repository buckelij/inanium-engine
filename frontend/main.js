import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';


document.addEventListener("DOMContentLoaded", function(event){
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
  .then(data => {
    console.log(data)
    const blogwrapper = document.getElementById("blog")
    const entries = data.data.person.blog.blogEntriesConnection.edges
    for (var i = 0; i < entries.length; i++){
      let entry = document.createElement("div")
      entry.className = "blogentry"
      entry.innerHTML = entries[i].node.body + "<hr>"
      blogwrapper.appendChild(entry)
    }
    document.getElementById("loading").remove()
    })
  .catch(error => console.log(error));
})

