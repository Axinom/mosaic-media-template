--! Previous: sha1:89691542feb70ab25693df50789489f678a4c68c
--! Hash: sha1:11e450dc90fd2ee5cb837872bb55f64dcfca8549
--! Message: improve-grants-on-gql-role

-- Remove this comment line and write your migration here. Make sure to keep one empty line between 'Message' header and first migration line to properly name future migration file.
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app_public FROM ":DATABASE_GQL_ROLE";
