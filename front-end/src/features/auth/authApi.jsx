import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:8000',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/jwt/refresh/',
          method: 'POST',
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        api.dispatch(setCredentials(refreshResult.data));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
      }
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/jwt/create/',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    refresh: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/jwt/refresh/',
        method: 'POST',
        body: refreshToken,
      }),
    }),

  }),
});

export const { useLoginMutation, useRefreshMutation, useGetProfileQuery } = authApi;
