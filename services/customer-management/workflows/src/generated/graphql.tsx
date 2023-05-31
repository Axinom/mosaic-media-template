import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type BasicResponse = {
  __typename?: 'BasicResponse';
  code?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
};

export type CreateCustomerInput = {
  email?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  ip_address?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  mac_address?: InputMaybe<Scalars['String']>;
  mobile?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  registration_country?: InputMaybe<Scalars['String']>;
  registration_region?: InputMaybe<Scalars['String']>;
  system?: InputMaybe<SystemType>;
};

export type Customer = {
  __typename?: 'Customer';
  activated?: Maybe<Scalars['Boolean']>;
  activation_date?: Maybe<Scalars['String']>;
  amazon_handle?: Maybe<Scalars['String']>;
  apple_handle?: Maybe<Scalars['String']>;
  b2b_handle?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['String']>;
  create_date?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['Boolean']>;
  facebook_handle?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  google_handle?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  last_ip_address?: Maybe<Scalars['String']>;
  last_login?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  last_user_agent?: Maybe<Scalars['String']>;
  mac_address?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  mobile_verified?: Maybe<Scalars['Boolean']>;
  registration_country?: Maybe<Scalars['String']>;
  registration_region?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  system?: Maybe<SystemType>;
  twitter_handle?: Maybe<Scalars['String']>;
};

export type CustomerFilters = {
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  mobile?: InputMaybe<Scalars['String']>;
  registrationCountry?: InputMaybe<Scalars['String']>;
  system?: InputMaybe<SystemType>;
};

export type CustomerInput = {
  after?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<CustomerFilters>;
  sort?: InputMaybe<CustomerSortOrder>;
};

export type CustomerSortOrder = {
  column?: InputMaybe<Scalars['String']>;
  columnSortKey?: InputMaybe<Scalars['String']>;
  direction?: InputMaybe<SortDirection>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCustomer?: Maybe<Customer>;
  deleteCustomer?: Maybe<BasicResponse>;
  resendActivation?: Maybe<BasicResponse>;
  resetPassword?: Maybe<BasicResponse>;
  updateCustomer?: Maybe<Customer>;
};


export type MutationCreateCustomerArgs = {
  input?: InputMaybe<CreateCustomerInput>;
};


export type MutationDeleteCustomerArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type MutationResendActivationArgs = {
  email?: InputMaybe<Scalars['String']>;
};


export type MutationResetPasswordArgs = {
  email?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCustomerArgs = {
  input?: InputMaybe<UpdateCustomerInput>;
};

export type PagedCustomers = {
  __typename?: 'PagedCustomers';
  customers: Array<Customer>;
  page: Scalars['Int'];
  page_size: Scalars['Int'];
  total: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getCustomer?: Maybe<Customer>;
  getCustomers?: Maybe<PagedCustomers>;
};


export type QueryGetCustomerArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryGetCustomersArgs = {
  input?: InputMaybe<CustomerInput>;
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export enum SystemType {
  External = 'External',
  Internal = 'Internal'
}

export type UpdateCustomerInput = {
  activated?: InputMaybe<Scalars['Boolean']>;
  activation_date?: InputMaybe<Scalars['String']>;
  amazon_handle?: InputMaybe<Scalars['String']>;
  apple_handle?: InputMaybe<Scalars['String']>;
  b2b_handle?: InputMaybe<Scalars['String']>;
  birthday?: InputMaybe<Scalars['String']>;
  create_date?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  email_verified?: InputMaybe<Scalars['Boolean']>;
  facebook_handle?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  google_handle?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  last_ip_address?: InputMaybe<Scalars['String']>;
  last_login?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  last_user_agent?: InputMaybe<Scalars['String']>;
  mac_address?: InputMaybe<Scalars['String']>;
  mobile?: InputMaybe<Scalars['String']>;
  mobile_verified?: InputMaybe<Scalars['Boolean']>;
  registration_country?: InputMaybe<Scalars['String']>;
  registration_region?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  system?: InputMaybe<SystemType>;
  twitter_handle?: InputMaybe<Scalars['String']>;
};

export type CreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', createCustomer?: { __typename?: 'Customer', first_name?: string | null, last_name?: string | null, email?: string | null, gender?: string | null, registration_country?: string | null } | null };

export type GetCustomerByIdQueryVariables = Exact<{
  customerId: Scalars['String'];
}>;


export type GetCustomerByIdQuery = { __typename?: 'Query', getCustomer?: { __typename?: 'Customer', id: string, first_name?: string | null, last_name?: string | null, email?: string | null, gender?: string | null, registration_country?: string | null } | null };

export type GetCustomerEmailByIdQueryVariables = Exact<{
  customerId: Scalars['String'];
}>;


export type GetCustomerEmailByIdQuery = { __typename?: 'Query', getCustomer?: { __typename?: 'Customer', email?: string | null } | null };

export type UpdateCustomerMutationVariables = Exact<{
  input?: InputMaybe<UpdateCustomerInput>;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', updateCustomer?: { __typename?: 'Customer', id: string, first_name?: string | null, last_name?: string | null, email?: string | null, gender?: string | null, registration_country?: string | null } | null };

export type DeleteCustomerMutationVariables = Exact<{
  Id: Scalars['String'];
}>;


export type DeleteCustomerMutation = { __typename?: 'Mutation', deleteCustomer?: { __typename?: 'BasicResponse', code?: number | null, message?: string | null } | null };

export type ResetPasswordMutationVariables = Exact<{
  email?: InputMaybe<Scalars['String']>;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: { __typename?: 'BasicResponse', code?: number | null, message?: string | null } | null };

export type ResendActivationMutationVariables = Exact<{
  email?: InputMaybe<Scalars['String']>;
}>;


export type ResendActivationMutation = { __typename?: 'Mutation', resendActivation?: { __typename?: 'BasicResponse', code?: number | null, message?: string | null } | null };

export type CustomerQueryVariables = Exact<{
  input?: InputMaybe<CustomerInput>;
}>;


export type CustomerQuery = { __typename?: 'Query', filtered?: { __typename?: 'PagedCustomers', total: number, page_size: number, page: number, customers: Array<{ __typename?: 'Customer', id: string, system?: SystemType | null, email?: string | null, email_verified?: boolean | null, mobile?: string | null, mobile_verified?: boolean | null, facebook_handle?: string | null, google_handle?: string | null, twitter_handle?: string | null, amazon_handle?: string | null, b2b_handle?: string | null, apple_handle?: string | null, first_name?: string | null, last_name?: string | null, mac_address?: string | null, birthday?: string | null, gender?: string | null, create_date?: string | null, activation_date?: string | null, activated?: boolean | null, last_login?: string | null, last_ip_address?: string | null, last_user_agent?: string | null, registration_country?: string | null, registration_region?: string | null, state?: string | null }> } | null };


export const CreateCustomerDocument = gql`
    mutation CreateCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    first_name
    last_name
    email
    gender
    registration_country
  }
}
    `;
export type CreateCustomerMutationFn = Apollo.MutationFunction<CreateCustomerMutation, CreateCustomerMutationVariables>;

/**
 * __useCreateCustomerMutation__
 *
 * To run a mutation, you first call `useCreateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerMutation, { data, loading, error }] = useCreateCustomerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerMutation, CreateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerMutation, CreateCustomerMutationVariables>(CreateCustomerDocument, options);
      }
export type CreateCustomerMutationHookResult = ReturnType<typeof useCreateCustomerMutation>;
export type CreateCustomerMutationResult = Apollo.MutationResult<CreateCustomerMutation>;
export type CreateCustomerMutationOptions = Apollo.BaseMutationOptions<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const GetCustomerByIdDocument = gql`
    query GetCustomerById($customerId: String!) {
  getCustomer(id: $customerId) {
    id
    first_name
    last_name
    email
    gender
    registration_country
  }
}
    `;

/**
 * __useGetCustomerByIdQuery__
 *
 * To run a query within a React component, call `useGetCustomerByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerByIdQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useGetCustomerByIdQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>(GetCustomerByIdDocument, options);
      }
export function useGetCustomerByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>(GetCustomerByIdDocument, options);
        }
export type GetCustomerByIdQueryHookResult = ReturnType<typeof useGetCustomerByIdQuery>;
export type GetCustomerByIdLazyQueryHookResult = ReturnType<typeof useGetCustomerByIdLazyQuery>;
export type GetCustomerByIdQueryResult = Apollo.QueryResult<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>;
export const GetCustomerEmailByIdDocument = gql`
    query GetCustomerEmailById($customerId: String!) {
  getCustomer(id: $customerId) {
    email
  }
}
    `;

/**
 * __useGetCustomerEmailByIdQuery__
 *
 * To run a query within a React component, call `useGetCustomerEmailByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerEmailByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerEmailByIdQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useGetCustomerEmailByIdQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerEmailByIdQuery, GetCustomerEmailByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerEmailByIdQuery, GetCustomerEmailByIdQueryVariables>(GetCustomerEmailByIdDocument, options);
      }
export function useGetCustomerEmailByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerEmailByIdQuery, GetCustomerEmailByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerEmailByIdQuery, GetCustomerEmailByIdQueryVariables>(GetCustomerEmailByIdDocument, options);
        }
export type GetCustomerEmailByIdQueryHookResult = ReturnType<typeof useGetCustomerEmailByIdQuery>;
export type GetCustomerEmailByIdLazyQueryHookResult = ReturnType<typeof useGetCustomerEmailByIdLazyQuery>;
export type GetCustomerEmailByIdQueryResult = Apollo.QueryResult<GetCustomerEmailByIdQuery, GetCustomerEmailByIdQueryVariables>;
export const UpdateCustomerDocument = gql`
    mutation UpdateCustomer($input: UpdateCustomerInput) {
  updateCustomer(input: $input) {
    id
    first_name
    last_name
    email
    gender
    registration_country
  }
}
    `;
export type UpdateCustomerMutationFn = Apollo.MutationFunction<UpdateCustomerMutation, UpdateCustomerMutationVariables>;

/**
 * __useUpdateCustomerMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerMutation, { data, loading, error }] = useUpdateCustomerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerMutation, UpdateCustomerMutationVariables>(UpdateCustomerDocument, options);
      }
export type UpdateCustomerMutationHookResult = ReturnType<typeof useUpdateCustomerMutation>;
export type UpdateCustomerMutationResult = Apollo.MutationResult<UpdateCustomerMutation>;
export type UpdateCustomerMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const DeleteCustomerDocument = gql`
    mutation DeleteCustomer($Id: String!) {
  deleteCustomer(id: $Id) {
    code
    message
  }
}
    `;
export type DeleteCustomerMutationFn = Apollo.MutationFunction<DeleteCustomerMutation, DeleteCustomerMutationVariables>;

/**
 * __useDeleteCustomerMutation__
 *
 * To run a mutation, you first call `useDeleteCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCustomerMutation, { data, loading, error }] = useDeleteCustomerMutation({
 *   variables: {
 *      Id: // value for 'Id'
 *   },
 * });
 */
export function useDeleteCustomerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCustomerMutation, DeleteCustomerMutationVariables>(DeleteCustomerDocument, options);
      }
export type DeleteCustomerMutationHookResult = ReturnType<typeof useDeleteCustomerMutation>;
export type DeleteCustomerMutationResult = Apollo.MutationResult<DeleteCustomerMutation>;
export type DeleteCustomerMutationOptions = Apollo.BaseMutationOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation resetPassword($email: String) {
  resetPassword(email: $email) {
    code
    message
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const ResendActivationDocument = gql`
    mutation resendActivation($email: String) {
  resendActivation(email: $email) {
    code
    message
  }
}
    `;
export type ResendActivationMutationFn = Apollo.MutationFunction<ResendActivationMutation, ResendActivationMutationVariables>;

/**
 * __useResendActivationMutation__
 *
 * To run a mutation, you first call `useResendActivationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendActivationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendActivationMutation, { data, loading, error }] = useResendActivationMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResendActivationMutation(baseOptions?: Apollo.MutationHookOptions<ResendActivationMutation, ResendActivationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendActivationMutation, ResendActivationMutationVariables>(ResendActivationDocument, options);
      }
export type ResendActivationMutationHookResult = ReturnType<typeof useResendActivationMutation>;
export type ResendActivationMutationResult = Apollo.MutationResult<ResendActivationMutation>;
export type ResendActivationMutationOptions = Apollo.BaseMutationOptions<ResendActivationMutation, ResendActivationMutationVariables>;
export const CustomerDocument = gql`
    query Customer($input: CustomerInput) {
  filtered: getCustomers(input: $input) {
    total
    page_size
    page
    customers {
      id
      system
      email
      email_verified
      mobile
      mobile_verified
      facebook_handle
      google_handle
      twitter_handle
      amazon_handle
      b2b_handle
      apple_handle
      first_name
      last_name
      mac_address
      birthday
      gender
      create_date
      activation_date
      activated
      last_login
      last_ip_address
      last_user_agent
      registration_country
      registration_region
      state
    }
  }
}
    `;

/**
 * __useCustomerQuery__
 *
 * To run a query within a React component, call `useCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCustomerQuery(baseOptions?: Apollo.QueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, options);
      }
export function useCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, options);
        }
export type CustomerQueryHookResult = ReturnType<typeof useCustomerQuery>;
export type CustomerLazyQueryHookResult = ReturnType<typeof useCustomerLazyQuery>;
export type CustomerQueryResult = Apollo.QueryResult<CustomerQuery, CustomerQueryVariables>;