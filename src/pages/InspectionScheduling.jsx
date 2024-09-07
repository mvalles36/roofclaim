import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '../integrations/supabase/supabase';

const InspectionScheduling = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [address, setAddress] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name');

    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      setCustomers(data);
    }
  };

  const handleScheduleInspection = async () => {
    if (!selectedDate || !address || !preferredTime || !selectedCustomer) {
      alert('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase
      .from('inspections')
      .insert([
        {
          scheduled_date: selectedDate.toISOString(),
          address,
          preferred_time: preferredTime,
          status: 'Scheduled',
          customer_id: selectedCustomer
        }
      ]);

    if (error) {
      alert('Error scheduling inspection: ' + error.message);
    } else {
      alert('Inspection scheduled successfully');
      setSelectedDate(null);
      setAddress('');
      setPreferredTime('');
      setSelectedCustomer('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Schedule Drone Roof Inspection</h2>
      <Card>
        <CardHeader>
          <CardTitle>Inspection Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customer">Select Customer</Label>
            <Select onValueChange={setSelectedCustomer} value={selectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="address">Property Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter property address"
            />
          </div>
          <div>
            <Label>Select a Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div>
            <Label htmlFor="preferredTime">Preferred Time</Label>
            <Input
              id="preferredTime"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              placeholder="Enter preferred time"
            />
          </div>
          <Button 
            onClick={handleScheduleInspection} 
            disabled={!selectedDate || !address || !preferredTime || !selectedCustomer}
          >
            Schedule Inspection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionScheduling;