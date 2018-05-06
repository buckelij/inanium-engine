const resolvers = {
  Query: {
    person(root, args) {
      return findPerson(args.handle);
    }
  },
  Person: {
    blog(person) {
      return { id: 1, title: "Ideasyncratic"};
    }
  },
  Blog: {
    entries(blog){
    return [{id:1, title: "a post", body: "some text"},
            {id:2, title: "second post", body: "two text"}];
          }
  },
  Resume: {

  }
};

function findPerson(handle) {
  if (handle.match(/^[a-zA-Z0-9]+$/)) {
    let person = require('../data/' + handle + '.json') //so secure
    return person
  }
}

export default resolvers;
