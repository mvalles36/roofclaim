import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const SalesProcessKPIs = () => {
  const { data: kpis, isLoading, error } = useQuery({
    queryKey: ['salesProcessKPIs'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_sales_process_kpis');
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading KPIs...</div>;
  if (error) return <div>Error loading KPIs: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard title="Avg. Deal Cycle" value={`${kpis.avg_deal_cycle} days`} />
      <KPICard title="Conversion Rate" value={`${kpis.conversion_rate}%`} />
      <KPICard title="Avg. Deal Size" value={`$${kpis.avg_deal_size}`} />
      <KPICard title="Win Rate" value={`${kpis.win_rate}%`} />
    </div>
  );
};

const KPICard = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default SalesProcessKPIs;