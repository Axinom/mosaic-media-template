module.exports = {
  client: {
    excludes: ['**/src/generated/**/*.{ts,tsx,js,jsx,graphql,gql}'],
    service: {
      name: 'catalog',
      localSchemaFile:
        'services/catalog/service/src/generated/graphql/schema.graphql',
    },
  },
};
