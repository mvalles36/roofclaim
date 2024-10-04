import { useState, useEffect } from 'react';
import {
  fetchSalesKPIs,
  fetchLeadFunnelData,
  fetchRecentSalesActivities,
  fetchSalesPerformance,
  fetchLeadSourceDistribution,
  fetchSalesProcess
} from '../services/apiService';

const useDashboardData = () => {
  const [kpis, setKpis] = useState({});
  const [leadFunnelData, setLeadFunnelData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [salesPerformance, setSalesPerformance] = useState([]);
  const [leadSourceDistribution, setLeadSourceDistribution] = useState([]);
  const [salesProcess, setSalesProcess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpisData, funnelData, activitiesData, performanceData, sourceData, processData] = await Promise.all([
          fetchSalesKPIs(),
          fetchLeadFunnelData(),
          fetchRecentSalesActivities(),
          fetchSalesPerformance(),
          fetchLeadSourceDistribution(),
          fetchSalesProcess()
        ]);

        setKpis(kpisData);
        setLeadFunnelData(funnelData);
        setRecentActivities(activitiesData);
        setSalesPerformance(performanceData);
        setLeadSourceDistribution(sourceData);
        setSalesProcess(processData);
      } catch (error) {
        setError(error);
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    kpis,
    leadFunnelData,
    recentActivities,
    salesPerformance,
    leadSourceDistribution,
    salesProcess,
    error
  };
};

export default useDashboardData;
