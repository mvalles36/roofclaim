import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '../integrations/supabase/supabase';

const CustomerDashboard = () => {
  const [inspectionStatus, setInspectionStatus] = useState('Not Scheduled');
  const [claimStatus, setClaimStatus] = useState('No Active Claims');
  const [installationProgress, setInstallationProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch inspection status
    const { data: inspectionData } = await supabase
      .from('inspections')
      .select('status')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (inspectionData) {
      setInspectionStatus(inspectionData.status);
    }

    // Fetch claim status
    const { data: claimData } = await supabase
      .from('claims')
      .select('status')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (claimData) {
      setClaimStatus(claimData.status);
    }

    // Fetch installation progress
    const { data: installationData } = await supabase
      .from('installations')
      .select('progress')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (installationData) {
      setInstallationProgress(installationData.progress);
    }

    // Fetch notifications
    const { data: notificationData } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (notificationData) {
      setNotifications(notificationData);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inspection Status</CardTitle>
          </CardHeader>
          <CardContent>{inspectionStatus}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Claim Status</CardTitle>
          </CardHeader>
          <CardContent>{claimStatus}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Installation Progress</CardTitle>
          </CardHeader>
          <CardContent>{installationProgress}%</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li key={notification.id}>{notification.message}</li>
              ))}
            </ul>
          ) : (
            <p>No new notifications</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
