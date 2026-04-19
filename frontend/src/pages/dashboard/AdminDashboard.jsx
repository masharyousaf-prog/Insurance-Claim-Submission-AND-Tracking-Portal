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
    <div className="space-y-8"> {/* Changed space-y-6 to space-y-8 for better spacing */}
      
      {/* --- EXISTING SYSTEM OVERVIEW SECTION --- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
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

      {/* --- NEW OFFICER REPORT SECTION --- */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-8">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Officer Performance Report</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 font-semibold border-b">
              <tr>
                <th className="px-6 py-3">Officer Name</th>
                <th className="px-6 py-3 text-center">Pending / Active</th>
                <th className="px-6 py-3 text-center text-green-700">Approved</th>
                <th className="px-6 py-3 text-center text-red-700">Rejected</th>
                <th className="px-6 py-3 text-center text-emerald-700">Settled</th>
                <th className="px-6 py-3 text-center font-bold">Total Handled</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(!stats.officerStats || stats.officerStats.length === 0) ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No officers have been assigned claims yet.
                  </td>
                </tr>
              ) : (
                stats.officerStats.map((officer, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {officer.officerName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                        {officer.pending}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-green-600">
                      {officer.approved}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-red-600">
                      {officer.rejected}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-emerald-600">
                      {officer.settled}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">
                      {officer.totalProcessed}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;