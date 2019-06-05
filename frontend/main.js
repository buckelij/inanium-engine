import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
const client = new ApolloClient({
  uri: 'https://inanium-engine.glitch.me/graphql'
});

const getBlogPage = (cursor) => {
console.log(cursor)
  return client.query({
   query: gql`
     query blogEntries($cursor: String) {
       person(handle:"buckelij"){
         blog{
           blogEntriesConnection(first: 2, after: $cursor){
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
   variables: {cursor: cursor},
  })
}

const insertBlogEntries = (data) => {
  console.log(data)
  const blogwrapper = document.getElementById("blog")
  const entries = data.data.person.blog.blogEntriesConnection.edges
  for (var i = 0; i < entries.length; i++){
    let entry = document.createElement("div")
    entry.className = "blogentry"
    entry.innerHTML = entries[i].node.body + "<hr>"
    blogwrapper.appendChild(entry)
  }
  if(document.getElementById("loading")){
    document.getElementById("loading").remove()
  }
  const loadButton = document.getElementById("loadmore")
  //endCursor isn't implemented yet, so get the last cursor from the results
  loadButton.setAttribute("data-cursor",      data.data.person.blog.blogEntriesConnection.edges.slice(-1)[0].cursor)
  loadButton.setAttribute("data-hasnextpage", data.data.person.blog.blogEntriesConnection.pageInfo.hasNextPage)
}

//load more button handler
const loadNextPage = () => {
  const loadButton = document.getElementById("loadmore")
  const cursor = loadButton.getAttribute("data-cursor")
  const hasNextPage = loadButton.getAttribute("data-hasnextpage")
  if (hasNextPage === "true"){
    getBlogPage(cursor).then(data => {
      insertBlogEntries(data)
    })
    .catch(error => console.log(error));
  }

  if (loadButton.getAttribute("data-hasnextpage") === "false") {
    loadButton.disabled = true
  }
}


//initial page load
document.addEventListener("DOMContentLoaded", function(event){
  getBlogPage(null).then(data => {
    insertBlogEntries(data)
   })
  .catch(error => console.log(error));
  document.getElementById("loadmore").addEventListener('click', loadNextPage);
})


