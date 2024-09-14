import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '../integrations/supabase/supabase';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      setCustomers(data);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canViewFullDetails = ['sales', 'sales_manager', 'admin', 'support', 'supplement_specialist'].includes(userRole);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customers</h1>
      <Input
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {filteredCustomers.map((customer) => (
              <li key={customer.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{customer.full_name}</p>
                  <p>{customer.email}</p>
                  {canViewFullDetails && (
                    <p>Customer Type: {customer.customer_type}</p>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedCustomer(customer)}>View Details</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{customer.full_name}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="details">
                      <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        {canViewFullDetails && (
                          <>
                            <TabsTrigger value="jobs">Jobs</TabsTrigger>
                            <TabsTrigger value="communication">Communication</TabsTrigger>
                            <TabsTrigger value="warranty">Warranty</TabsTrigger>
                          </>
                        )}
                      </TabsList>
                      <TabsContent value="details">
                        <div className="space-y-2">
                          <p><strong>Email:</strong> {customer.email}</p>
                          <p><strong>Phone:</strong> {customer.phone_number}</p>
                          <p><strong>Address:</strong> {customer.address}</p>
                          <p><strong>Customer Type:</strong> {customer.customer_type}</p>
                          <p><strong>Preferred Contact Method:</strong> {customer.preferred_contact_method}</p>
                        </div>
                      </TabsContent>
                      {canViewFullDetails && (
                        <>
                          <TabsContent value="jobs">
                            <p>Job history will be displayed here.</p>
                          </TabsContent>
                          <TabsContent value="communication">
                            <p>Communication history will be displayed here.</p>
                          </TabsContent>
                          <TabsContent value="warranty">
                            <p>Warranty details will be displayed here.</p>
                          </TabsContent>
                        </>
                      )}
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
