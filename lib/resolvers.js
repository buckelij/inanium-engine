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
        before: args.before,
        after: args.after,
        first: args.first,
        last: args.last
      }
    }
  },
  BlogEntriesConnection: {
    // could call findBlogEntries and then extract pageinfo from that return
    edges(page, args, context) {
      console.log("WHO" + JSON.stringify(page) + JSON.stringify(args) + JSON.stringify(context))
      return findBlogEntries(page)
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
// entries before/after non-inclusive. if <base64 of entry file name> is empty, starts from the beginning
// use last and before to go backwards, and first and after to go forwards
function findBlogEntries(page) {
  let cursor = page.after || page.before || (btoa(page.entriesDir) + ":")
  let [blogEntriesDir64, blogEntryName64] = cursor.split(":")
  if (! blogEntriesDir64){return []}
  let [blogEntriesDir, blogEntryName] = [atob(blogEntriesDir64), atob(blogEntryName64)]

  let blogEntries = []
  if (noBamboozle(blogEntriesDir) && noBamboozle(blogEntryName)){
    blogEntries = fs.readdirSync(path.resolve(__dirname, '../data', blogEntriesDir))
  } else {return []}

  // if the blogEntryName doesn't exist in the list, indexOf returns -1.
  // -1 + 1 is 0, so we start at the beginning. :ok:
  let blogEntryOffset = page.before ? blogEntries.indexOf(blogEntryName) - 1 : blogEntries.indexOf(blogEntryName) + 1
  let edges = []
  let count = Math.min(3, page.first || page.last)
  for (let i = 0; i < count; i++) {
    let blogEntryIndex = page.before ? blogEntryOffset - i : blogEntryOffset + i
    if (! page.before && page.last) {
      blogEntryIndex = blogEntries.length - 1 //XXX: this seems gross
    }
    if (blogEntries[blogEntryIndex]){
      edges.push({ 
        cursor: buildCursor(blogEntriesDir, blogEntries[blogEntryIndex]),
        node: {
          date: blogEntries[blogEntryIndex],
          body: fs.readFileSync(path.resolve(__dirname, '../data', 
                  blogEntriesDir, blogEntries[blogEntryIndex], 
                  blogEntries[blogEntryIndex] + ".html"), 'utf8'
                )
          }
      })
    }    
  }
  return edges
}

function hasNextPage(blogEntry, blogEntries){
  return (blogEntries.indexOf(blogEntry) < (blogEntries.length - 1))
}

function hasPreviousPage(blogEntry, blogEntries){
 return (blogEntries.indexOf(blogEntry) === 0)
}

function buildCursor(blogName, blogEntry){
  return btoa(blogName) + ":" + btoa(blogEntry)
}

//super secure check against path traversal ;)
function noBamboozle(str){
  return ( str === '' || str.match(/^[a-zA-Z0-9]+$/))
}

export default resolvers;
