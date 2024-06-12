module.exports = {
  client: {
    excludes: [
      '**/node_modules',
      '**/src/tests/**',
      '**/src/**/*.{ts,tsx}',
      '**/src/generated/**/*.{ts,tsx,js,jsx,graphql,gql}',
    ],
    service: {
      name: 'channel',
      localSchemaFile:
        'services/channel/service/src/generated/graphql/schema.graphql',
    },
  },
};
