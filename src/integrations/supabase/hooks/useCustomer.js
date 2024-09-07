import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Customer

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | integer                  | bigint | true     |
| created_at | timestamp with time zone | string | true     |

Note: 
- id is a Primary Key.
- created_at has a default value of now().

*/

export const useCustomers = () => useQuery({
    queryKey: ['customers'],
    queryFn: () => fromSupabase(supabase.from('Customer').select('*')),
});

export const useCustomer = (id) => useQuery({
    queryKey: ['customers', id],
    queryFn: () => fromSupabase(supabase.from('Customer').select('*').eq('id', id).single()),
});

export const useAddCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCustomer) => fromSupabase(supabase.from('Customer').insert([newCustomer])),
        onSuccess: () => {
            queryClient.invalidateQueries('customers');
        },
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('Customer').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('customers');
        },
    });
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Customer').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('customers');
        },
    });
};