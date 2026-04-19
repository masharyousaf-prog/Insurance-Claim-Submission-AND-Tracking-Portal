import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

// 1. Moved StatCard OUTSIDE of the main AdminDashboard component
const StatCard = ({ title, count, colorClass }) => (
  <div className={`p-6 rounded-lg shadow-sm text-white ${colorClass}`}>
    <h3 className="text-lg font-medium opacity-90">{title}</h3>
    <p className="text-4xl font-bold mt-2">{count}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Total Claims" count={stats.total} colorClass="bg-blue-600" />
        <StatCard title="Submitted" count={stats.submitted} colorClass="bg-slate-500" />
        <StatCard title="Under Review" count={stats.under_review} colorClass="bg-yellow-500" />
        <StatCard title="Info Required" count={stats.info_required} colorClass="bg-orange-500" />
        <StatCard title="Approved" count={stats.approved} colorClass="bg-green-600" />
        <StatCard title="Rejected" count={stats.rejected} colorClass="bg-red-600" />
        <StatCard title="Settled" count={stats.settled} colorClass="bg-emerald-700" />
      </div>
    </div>
  );
};

export default AdminDashboard;