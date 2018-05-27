import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import schema from './lib/schema';
import { tester } from 'graphql-tester';
import assert from 'assert'

//import {create as createExpressWrapper} from 'node_modules/graphql-tester/src/main/servers/express.js';
// Why doesn't ^ work?

const graphQLServer = express();
graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

const gql = tester({
    server: createExpressWrapper(graphQLServer),
    url: '/graphql',
    contentType: 'application/json'
})

const okr = (msg) => {console.log("test " + msg + ": OK")}
const failr = (msg) => {console.log("test " +msg + ": FAIL")}

{let test = "INANIUM_DATA set"
    if ("../test/data" === process.env["INANIUM_DATA"]){
        okr(test)
    } else {
        failr(test)
    }
}

{let test = "handle returned" 
     gql(JSON.stringify(
        {query: `
            {
            person(handle: \"buckelij\"){
                handle
            }
            }`
        })
    ).then( (data) => {
        if(JSON.parse(data.raw).data.person.handle, "buckelij"){
            okr(test)
        } else {failr(test)}
    })
}

{let test = "returns a blog entry"
    gql(JSON.stringify(
        {query: `
            {
                person(handle: \"buckelij\"){
                    blog{
                        blogEntriesConnection(first:1){
                        edges{
                            node{
                            body
                            }
                        }
                        }
                    }
                }
            }`
        })
    ).then(success => {
        if(JSON.parse(success.raw).data.person.blog.blogEntriesConnection.edges[0].node.body.indexOf("Line1") != -1) {
            okr(test)
        } else {failr(test)}
    }, error => {failr(test)})
}


//from node_modules/graphql-tester/src/main/servers/express.js
function createExpressWrapper(app) {
    return {
        creator: (port) => {
            return new Promise((resolve, reject) => {
                const server = app.listen(port, () => {
                    resolve({
                        server: {
                            shutdown: () => {
                                server.close();
                            }
                        },
                        url: `http://localhost:${port}`
                    });
                });
            });
        }
    };
}
