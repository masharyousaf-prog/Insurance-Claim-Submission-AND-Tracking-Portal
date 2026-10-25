import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClaims: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  });

  const [officerStats, setOfficerStats] = useState([]);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await axiosInstance.get("/admin/stats");
        const data = response.data;

        setStats({
          totalClaims: data.total || 0,
          underReview: data.under_review || 0,
          approved: data.approved || 0,
          rejected: data.rejected || 0,
        });

        // 🔑 CRITICAL FIX: Map the backend API variable names to match what your UI is expecting
        const mappedOfficers = (data.officerStats || []).map((officer) => ({
          name: officer.officerName || "Unknown",
          totalAssigned: officer.totalProcessed || 0,
          approved: officer.approved || 0,
          pending: officer.pending || 0,
          rejected: officer.rejected || 0,
        }));

        setOfficerStats(mappedOfficers);
      } catch (error) {
        console.error("Failed to load metrics:", error);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto relative z-10">
      {/* 🔑 MAIN HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white transition-colors duration-300">
          System Overview
        </h1>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 transition-colors duration-300">
          Real-time processing metrics and officer performance
        </p>
      </div>

      {/* 📊 METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Claims
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats.totalClaims}
            </span>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            All time records
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse" />{" "}
              Under Review
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats.underReview}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            Active caseload
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />{" "}
              Approved
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats.approved}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Processed successfully
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5" />{" "}
              Rejected
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats.rejected}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400">
            Declined claims
          </p>
        </div>
      </div>

      {/* 📉 DYNAMIC PERFORMANCE REPORT SECTION */}
      <div className="relative rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 mt-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
            Officer Performance Report
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Claim resolution rates per assigned officer
          </p>
        </div>

        {officerStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-slate-300/50 dark:border-slate-800 bg-white/10 dark:bg-slate-950/20">
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 text-center">
              No officers have been assigned claims yet.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {officerStats.map((officer, index) => {
              // 🧮 CALCULATE PERCENTAGES DYNAMICALLY
              const approvedRate =
                officer.totalAssigned > 0
                  ? Math.round((officer.approved / officer.totalAssigned) * 100)
                  : 0;
              const rejectedRate =
                officer.totalAssigned > 0
                  ? Math.round((officer.rejected / officer.totalAssigned) * 100)
                  : 0;
              const pendingRate =
                officer.totalAssigned > 0
                  ? Math.round((officer.pending / officer.totalAssigned) * 100)
                  : 0;

              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl bg-white/5 dark:bg-black/20 border border-white/20 dark:border-white/5 backdrop-blur-md shadow-inner transition-colors duration-200 gap-6"
                >
                  {/* LEFT: Identity */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30 text-lg">
                      {officer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        {officer.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Total Assigned: {officer.totalAssigned}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: Visual Distribution Bar */}
                  <div className="flex-1 w-full max-w-xl">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {approvedRate}% Approved
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {pendingRate}% Pending
                      </span>
                      <span className="text-rose-600 dark:text-rose-400">
                        {rejectedRate}% Declined
                      </span>
                    </div>

                    {/* The Multi-Color Progress Bar */}
                    <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${approvedRate}%` }}
                        className="bg-emerald-500 hover:bg-emerald-400 transition-all duration-500"
                      ></div>
                      <div
                        style={{ width: `${pendingRate}%` }}
                        className="bg-amber-500 hover:bg-amber-400 transition-all duration-500"
                      ></div>
                      <div
                        style={{ width: `${rejectedRate}%` }}
                        className="bg-rose-500 hover:bg-rose-400 transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
