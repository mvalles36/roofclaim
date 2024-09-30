import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import SalesCelebrationModal from '@/components/SalesCelebrationModal';

const Index = () => {
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [celebratingSalesperson, setCelebratingSalesperson] = useState('');

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  useEffect(() => {
    const subscription = supabase
      .channel('job-created')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'jobs',
      }, async (payload) => {
        if (payload.new.status === 'pending') {
          const { data: creator } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', payload.new.created_by)
            .single();

          if (creator) {
            setCelebratingSalesperson(`${creator.first_name} ${creator.last_name}`);
            setIsCelebrationModalOpen(true);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Sales Dashboard</h1>
      {currentUser && currentUser.role === 'sales' && (
        <SalesCelebrationModal
          isOpen={isCelebrationModalOpen}
          onClose={() => setIsCelebrationModalOpen(false)}
          salesperson={celebratingSalesperson}
        />
      )}
    </div>
  );
};

export default Index;
