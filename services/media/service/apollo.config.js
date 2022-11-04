module.exports = {
  client: {
    excludes: [
      '**/src/tests/**',
      '**/src/generated/**/*.{ts,tsx,js,jsx,graphql,gql}',
    ],
    service: {
      name: 'media',
      localSchemaFile:
        'services/media/service/src/generated/graphql/schema.graphql',
    },
  },
};
