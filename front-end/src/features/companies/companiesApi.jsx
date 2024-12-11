import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const companiesApi = createApi({
  reducerPath: 'companiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    fetchCompanies: builder.query({
      query: () => '/companies/',
      providesTags: ['Company'],
    }),
    fetchCompanyById: builder.query({
      query: (id) => `/companies/${id}`,
      providesTags: (result, error, id) => [{ type: 'Company', id }],
    }),
    addCompany: builder.mutation({
      query: (company) => ({
        url: '/companies/',
        method: 'POST',
        body: company,
      }),
      invalidatesTags: ['Company'],
    }),
    updateCompany: builder.mutation({
      query: ({ id, ...company }) => ({
        url: `/companies/${id}/`,
        method: 'PUT',
        body: company,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Company', id }],
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/companies/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Company', id }],
    }),
  }),
});

export const {
  useFetchCompaniesQuery,
  useFetchCompanyByIdQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApi;
