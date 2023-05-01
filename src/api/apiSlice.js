import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    // Можно и не создавать, тогда будет автоматически подставлена эта строка
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3001'}),
    tagTypes: ['Heroes'],
    // создаем тег. Можно создавать и использовать сразу несколько, это массив
    endpoints: builder => ({
        getHeroes: builder.query({
            query: () => '/heroes',
            providesTags: ['Heroes']
            // обозначаем где этот тег используется, к чему он относится
        }),
        addHero: builder.mutation({
            query: hero => ({
                url: '/heroes',
                method: 'POST',
                body: hero
            }),
            invalidatesTags: ['Heroes']
            // обозначаем какое действие должно привести к использованию этого тега
        }),
        deleteHero: builder.mutation({
            query: id => ({
                url: `/heroes/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Heroes']
        })
    })
})

export const {useGetHeroesQuery, useAddHeroMutation, useDeleteHeroMutation} = apiSlice;