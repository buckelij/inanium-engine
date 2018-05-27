import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import schema from './lib/schema';
import { tester } from 'graphql-tester';
//import {create as createExpressWrapper} from 'node_modules/graphql-tester/src/main/servers/express.js';
// Why doesn't ^ work?

const graphQLServer = express();
graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

const gql = tester({
    server: createExpressWrapper(graphQLServer),
    url: '/graphql',
    contentType: 'application/json'
})

// gql(JSON.stringify({query:'{query {person(handle: \"buckelij\"){handle}}'})).then( (data) => {
//     console.log(JSON.stringify(data))
// })

gql("{\"query\": \"{person(handle: \\\"buckelij\\\"){handle}}\"}").then( (data) => {
    console.log(JSON.stringify(data))
})

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


// #works
// curl -H 'Content-Type: application/json' -XPOST https://inanium-engine.glitch.me/graphql -d "{\"query\": \"{person(handle: \\\"buckelij\\\"){handle}}\"}"