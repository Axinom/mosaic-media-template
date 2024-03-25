--! Previous: sha1:a588014c99783319a56e38380e970b4877d2257c
--! Hash: sha1:4a82e9d577afc339b96a80e41df75fee7615c479
--! Message: improve-grants-on-gql-role

REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app_public FROM ":DATABASE_GQL_ROLE";
