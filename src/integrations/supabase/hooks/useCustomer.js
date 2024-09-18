import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Contacts

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | integer                  | bigint | true     |
| created_at | timestamp with time zone | string | true     |

Note: 
- id is a Primary Key.
- created_at has a default value of now().

*/

export const useContacts = () => useQuery({
    queryKey: ['contacts'],
    queryFn: () => fromSupabase(supabase.from('Contacts').select('*')),
});

export const useContacts = (id) => useQuery({
    queryKey: ['contacts', id],
    queryFn: () => fromSupabase(supabase.from('Contacts').select('*').eq('id', id).single()),
});

export const useAddContacts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newContacts) => fromSupabase(supabase.from('Contacts').insert([newContacts])),
        onSuccess: () => {
            queryClient.invalidateQueries('contacts');
        },
    });
};

export const useUpdateContacts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('Contacts').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('contacts');
        },
    });
};

export const useDeleteContacts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Contacts').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('contacts');
        },
    });
};
