import axios, { AxiosError, AxiosResponse } from 'axios';

interface GetCustomersInputData {
  input: {
    after: string;
    filter: {
      email: string;
      firstName: string;
      id: string;
      lastName: string;
      mobile: string;
      registrationCountry: string;
      system: boolean;
    };
    sort: {
      column: string;
      columnSortKey: string;
      direction: 'asc' | 'desc';
    };
  };
}

interface UpdateCustomerInputData {
  input: {
    id: string;
    system?: boolean;
    email?: string;
    email_verified?: boolean;
    mobile?: string;
    mobile_verified?: boolean;
    facebook_handle?: string;
    google_handle?: string;
    twitter_handle?: string;
    amazon_handle?: string;
    b2b_handle?: string;
    apple_handle?: string;
    first_name?: string;
    last_name?: string;
    mac_address?: string;
    birthday?: string;
    gender?: string;
    create_date?: string;
    activation_date?: string;
    activated?: boolean;
    last_login?: string;
    last_ip_address?: string;
    last_user_agent?: string;
    registration_country?: string;
    registration_region?: string;
    state?: string;
  };
}

interface CreateCustomerInput {
  input: {
    email?: string;
    mobile?: string;
    password: string;
    first_name?: string;
    last_name?: string;
    system?: boolean;
    mac_address?: string;
    ip_address?: string;
    registration_country?: string;
    registration_region?: string;
  };
}

export const resolvers = {
  Query: {
    getCustomers: async (
      _query: unknown,
      args: GetCustomersInputData,
    ): Promise<unknown> => {
      try {
        const { input } = args;
        const response = await axios.get('/v1/manage/customer', {
          params: {
            email: input.filter?.email,
            first_name: input.filter?.firstName,
            id: input.filter?.id,
            last_name: input.filter?.lastName,
            mobile: input.filter?.mobile,
            page: input.after || 1,
            registration_country: input.filter?.registrationCountry,
            sort_by_field: input.sort?.column,
            sort_order: input.sort?.direction,
            system: input.filter?.system,
          },
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError: AxiosError = error;
          if (axiosError.response) {
            return axiosError.response.data;
          }
        }
        return error;
      }
    },
    getCustomer: async (
      _query: unknown,
      args: Record<string, unknown>,
    ): Promise<unknown> => {
      try {
        const response = await axios.get('/v1/manage/customer/' + args.id);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError: AxiosError = error;
          if (axiosError.response) {
            return axiosError.response.data;
          }
        }
        return error;
      }
    },
  },
  Mutation: {
    createCustomer: async (
      _query: unknown,
      args: CreateCustomerInput,
    ): Promise<unknown> => {
      try {
        const response = await axios.post('/v1/manage/customer/', args.input);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError: AxiosError = error;
          if (axiosError.response) {
            return axiosError.response.data;
          }
        }
        return error;
      }
    },
    updateCustomer: async (
      _query: unknown,
      args: UpdateCustomerInputData,
    ): Promise<unknown> => {
      try {
        const response = await axios.put('/v1/manage/customer/', args.input);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError: AxiosError = error;
          if (axiosError.response) {
            return axiosError.response.data;
          }
        }
        return error;
      }
    },
    deleteCustomer: async (
      _query: unknown,
      args: Record<string, unknown>,
    ): Promise<unknown> => {
      try {
        const response = await axios.delete('/v1/manage/customer/' + args.id);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError: AxiosError = error;
          if (axiosError.response) {
            return axiosError.response.data;
          }
        }
        return error;
      }
    },
    resetPassword: async (
      _query: unknown,
      args: Record<string, unknown>,
    ): Promise<unknown> => {
      try {
        const response = await axios.post(
          '/v1/user/passwordforgottenemail',
          args.email,
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError: AxiosError = error;
          if (axiosError.response) {
            return axiosError.response.data;
          }
        }
        return error;
      }
    },
    resendActivation: async (
      _query: unknown,
      args: Record<string, unknown>,
    ): Promise<unknown> => {
      try {
        const response: AxiosResponse = await axios.post(
          '/v1/user/resendconfirmationemail',
          args.email,
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError: AxiosError = error;
          if (axiosError.response) {
            return axiosError.response.data;
          }
        }
        return error;
      }
    },
  },
};
