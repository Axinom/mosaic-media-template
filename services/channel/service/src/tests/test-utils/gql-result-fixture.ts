/**
 * Test fixture shape of a generated GraphQL operation result type, with all
 * nullable fields made optional (applied recursively).
 *
 * Since `@graphql-codegen/typescript-operations` v6, nullable result fields are
 * generated as required (`field: T | null`), which matches what a GraphQL
 * server returns. Unit test fixtures that mock SDK responses only list the
 * fields a test cares about, so they use this type instead.
 */
export type GqlResultFixture<T> = T extends readonly (infer U)[]
  ? GqlResultFixture<U>[]
  : T extends object
    ? {
        [K in keyof T as null extends T[K] ? K : never]?: GqlResultFixture<
          T[K]
        >;
      } & {
        [K in keyof T as null extends T[K] ? never : K]: GqlResultFixture<T[K]>;
      }
    : T;
