const atob = require('atob')
const btoa = require('btoa')
const fs = require('fs')
const path = require('path')

const resolvers = {
  Query: {
    person(root, args, context) {
      return findPerson(args.handle)
    }
  },
  Person: {
    blog(person, args, context) {
      return findBlog(person.blog)
    },
    resume(person, args, context) {
      return { id: 1, body: findPerson(person.handle).resume} //stub
    }
  },
  Blog: {
    blogEntriesConnection(blog, args, context) {
      console.log("WHAT" + JSON.stringify(blog) + JSON.stringify(args) + JSON.stringify(context))
      //return metadata necessary for BlogEntriesConnection::edges to resolve. This is "page" below
      return {
        entriesDir: blog.entriesDir,
        cursor: args.after
      }
    }
  },
  BlogEntriesConnection: {
    // could call findBlogEntries and then extract pageinfo from that return
    edges(page, args, context) {
      console.log("WHO" + JSON.stringify(page) + JSON.stringify(args) + JSON.stringify(context))
      if(page.cursor){
        return findBlogEntries(page.cursor)
      }else {
        return findBlogEntries(btoa(page.entriesDir) + ":")
      }
    }
  }
};

function findPerson(handle) {
  if (noBamboozle(handle)) {
    let person = require(path.resolve(__dirname, '../data', handle + '.json'))
    return person
  }
}

function findBlog(name) {
  if (noBamboozle(name)) {
    return require(path.resolve(__dirname, '../data', name + '.json'))
  }
}

// returns a page (up to 3 entries) of blog entries
// takes an opaque id (<base64 of blog entries dir name>:<base64 of blog entry file name>) and returns
// entries after non-inclusive. if <base64 of entry file name> is empty, starts from the beginning
function findBlogEntries(oid, beforeOrAfter) {
  let [blogEntriesDir64, blogEntryName64] = oid.split(":")
  if (! blogEntriesDir64){return null}
  let [blogEntriesDir, blogEntryName] = [atob(blogEntriesDir64), atob(blogEntryName64)]
  let blogEntries = []
  if (noBamboozle(blogEntriesDir) && noBamboozle(blogEntryName)){
    blogEntries = fs.readdirSync(path.resolve(__dirname, '../data', blogEntriesDir))
  } else {return null}
  // if the blogEntryName doesn't exist in the list, indexOf returns -1.
  // -1 + 1 is 0, so we start at the beginning. :ok:
  let blogEntryOffset = blogEntries.indexOf(blogEntryName) + 1
  let edges = []
  for (let i = 0; i < 3; i++ ) {
    edges.push({ 
      cursor: cursor(blogEntriesDir, blogEntries[blogEntryOffset + i]),
      node: {
        date: blogEntries[blogEntryOffset + i],
        body: fs.readFileSync(path.resolve(__dirname, '../data', 
                blogEntriesDir, blogEntries[blogEntryOffset + i], 
                blogEntries[blogEntryOffset + i] + ".html"), 'utf8'
              )
        }
    })
  }
  console.log(JSON.stringify(edges))
  return edges
}

function hasNextPage(blogEntry, blogEntries){
  return (blogEntries.indexOf(blogEntry) < (blogEntries.length - 1))
}

function hasPreviousPage(blogEntry, blogEntries){
 return (blogEntries.indexOf(blogEntry) === 0)
}

function cursor(blogName, blogEntry){
  return btoa(blogName) + ":" + btoa(blogEntry)
}

//super secure check against path traversal ;)
function noBamboozle(str){
  return ( str === '' || str.match(/^[a-zA-Z0-9]+$/))
}

export default resolvers;
