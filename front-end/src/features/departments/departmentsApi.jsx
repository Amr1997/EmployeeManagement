import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const departmentsApi = createApi({
  reducerPath: 'departmentsApi',
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
    fetchDepartments: builder.query({
      query: () => '/departments/',
    }),
    fetchDepartmentById: builder.query({
      query: (id) => `/departments/${id}`,
    }),
    createDepartment: builder.mutation({
      query: (department) => ({
        url: '/departments/',
        method: 'POST',
        body: department,
      }),
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/departments/${id}/`,
        method: 'DELETE',
      }),
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/departments/${id}/`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchDepartmentsQuery,
  useFetchDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useUpdateDepartmentMutation,
} = departmentsApi;
