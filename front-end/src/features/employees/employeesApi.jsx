import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const employeesApi = createApi({
  reducerPath: 'employeesApi',
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
  endpoints: (builder) => ({
    fetchEmployees: builder.query({
      query: () => '/employees/',
    }),
    fetchEmployeeById: builder.query({
      query: (id) => `/employees/${id}`,
    }),
    createEmployee: builder.mutation({
      query: (employee) => ({
        url: '/employees/',
        method: 'POST',
        body: employee,
      }),
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employees/${id}/`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchEmployeesQuery,
  useFetchEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi;
