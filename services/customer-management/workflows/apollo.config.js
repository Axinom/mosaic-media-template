module.exports = {
  client: {
    excludes: [
      '**/node_modules',
      '**/src/tests/**',
      '**/src/**/*.{ts,tsx}',
      '**/src/generated/**/*.{ts,tsx,js,jsx,graphql,gql}',
    ],
    service: {
      name: 'user',
      localSchemaFile:
        'services/user/service/src/generated/graphql/schema.graphql',
    },
  },
};
