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

const test = (msg) => {process.stdout.write(msg + ": ")}

test("Test handle returned")
gql(JSON.stringify(
    {query: `
        {
          person(handle: \"buckelij\"){
            handle
          }
        }`
    })
).then( (data) => {
    assert.equal(JSON.parse(data.raw).data.person.handle, "bucelij")
    console.log("OK")
}).catch(() => {console.log("FAIL")})

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
