import { GraphQLClient } from 'graphql-request';

const gqlClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT || '', {
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': process.env.GRAPHQL_ADMIN_SECRET || '',
  },
});

export default gqlClient;
