const { ApolloServer } = require('apollo-server')
import { typeDefs, resolvers } from './lib/schema'
const { createTestClient } = require('apollo-server-testing')
const gql = require('graphql-tag');
const graphQLServer = new ApolloServer({ typeDefs, resolvers })
const { query } = createTestClient(graphQLServer)

async function runTests() {

    let passed = true
    const okr = (msg) => {
        console.log("test " + msg + ": OK")
    }
    const failr = (msg) => {
        console.log("test " +msg + ": FAIL")
        passed = false
    }

    await (async () => {let test = "INANIUM_DATA set"
        if ("../test/data" === process.env["INANIUM_DATA"]){
            passed = true
            okr(test)
        } else {
            failr(test)
        }
    })()

    await (async () => {let test = "handle returned"
        await query({ query: gql`
            query($handle: String!) {
                person(handle: $handle) {
                    handle
                }
            }`, variables: { handle: "buckelij" } }
        ).then( d => {
            if(d.data.person.handle ===  "buckelij"){
                okr(test)
            } else {
                failr(test)
            }
        }).catch(failr)
    })()

    await (async () => {let test = "returns a blog entry"
        await query({ query: gql`
            query($handle: String!) {
                person(handle: $handle) {
                    blog {
                        blogEntriesConnection(first:1) {
                            edges { node { body } }
                        }
                    }
                }
            }`, variables: { handle: "buckelij" } }
        ). then(d => {
            if(d.data.person.blog.blogEntriesConnection.edges[0].node.body.indexOf("Line7") != -1) {
                okr(test)
            } else {
                failr(test)
            }
        }).catch(failr)
    })()

    return passed
}

runTests().then( passed => {
    if (passed) {
        setTimeout(() => {
            console.log("All tests passed")
        }, 0)
    } else {
        setTimeout(() => {
            console.log("One or more tests failed")
            process.exit(1)
        }, 0)
    }
}).catch( e => {
    console.log("One or more tests failed")
    process.exit(1)
})
