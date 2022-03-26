// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { ApolloClient, InMemoryCache } from '@apollo/client'

const APIURL = 'https://api-mumbai.lens.dev/'

export const apolloClient= new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})