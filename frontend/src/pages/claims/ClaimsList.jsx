import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

const STATUS_BADGE = {
  approved:
    "bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
  settled:
    "bg-slate-200/80 dark:bg-slate-500/20 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-500/30",
  rejected:
    "bg-red-100/80 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-500/30",
  submitted:
    "bg-blue-100/80 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
  "under review":
    "bg-amber-100/80 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
  "additional info required":
    "bg-orange-100/80 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-500/30",
};

const ClaimsList = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [assignmentFilter, setAssignmentFilter] = useState("unassigned");

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/claims", {
        // 🔑 UPDATED: Set limit to 2 instead of 10 to enable pagination with 3 database items
        params: {
          search,
          status: statusFilter,
          page: pageIndex + 1,
          limit: 2,
          assignment: assignmentFilter,
        },
      });
      setData(res.data.data ?? res.data);
      setTotalPages(res.data.lastPage ?? 1);
      setTotalCount(res.data.total ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, pageIndex, assignmentFilter]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const columns = useMemo(
    () => [
      {
        header: "Claim ID",
        accessorKey: "id",
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
            #{String(info.getValue()).padStart(4, "0")}
          </span>
        ),
      },
      {
        header: "Title",
        accessorKey: "title",
        cell: (info) => (
          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] block transition-colors">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const v = info.getValue() || "submitted";
          return (
            <span
              className={`inline-flex px-3 py-1 rounded-md text-xs font-bold border uppercase tracking-wider backdrop-blur-sm transition-colors ${STATUS_BADGE[v] ?? STATUS_BADGE.submitted}`}
            >
              {v}
            </span>
          );
        },
      },
      {
        header: "Applicant",
        accessorFn: (row) => row.user?.name ?? "Unknown",
        cell: (info) => (
          <span className="text-slate-600 dark:text-slate-300 font-bold transition-colors">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        cell: (info) => (
          <span className="text-slate-500 dark:text-slate-400 font-bold transition-colors">
            {new Date(info.getValue()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        id: "actions",
        cell: (info) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/claims/${info.row.original.id}`);
            }}
            className="text-xs font-bold text-slate-700 dark:text-white bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/50 dark:hover:bg-white/20 border border-slate-300/50 dark:border-white/10 px-4 py-2 rounded-lg transition-all backdrop-blur-md"
          >
            View Details
          </button>
        ),
      },
    ],
    [navigate],
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm dark:drop-shadow-md transition-colors duration-500">
            {user?.role === "policyholder"
              ? "My Claims History"
              : "Claims Queue"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-bold transition-colors duration-500">
            {totalCount > 0
              ? `Showing ${totalCount} recorded claims`
              : "No claims found"}
          </p>
        </div>
        {user?.role === "policyholder" && (
          <Button onClick={() => navigate("/claims/new")} variant="primary">
            + Submit New Claim
          </Button>
        )}
      </div>

      <Card delay={0.1} className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 flex flex-wrap gap-3 items-center justify-between transition-colors duration-500">
          <div className="flex gap-3 flex-1">
            <input
              type="text"
              placeholder="Search claims..."
              className="px-4 py-2 text-sm bg-white/60 dark:bg-black/20 border border-white/60 dark:border-white/10 rounded-xl focus:outline-none focus:bg-white focus:dark:bg-black/40 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium transition-all min-w-[200px]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageIndex(0);
              }}
            />
            <select
              className="px-4 py-2 text-sm bg-white/60 dark:bg-[#0B0F19]/80 border border-white/60 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-500/50 text-slate-700 dark:text-white font-bold transition-all"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPageIndex(0);
              }}
            >
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {user?.role === "officer" && (
            <div className="flex bg-slate-200/50 dark:bg-black/20 p-1 rounded-xl border border-white/60 dark:border-white/5 transition-colors duration-500">
              {[
                ["unassigned", "Unassigned Queue"],
                ["mine", "My Caseload"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => { setAssignmentFilter(val); setPageIndex(0); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    assignmentFilter === val
                      ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <Loader text="Loading records..." />
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-black/20 border-b border-white/60 dark:border-white/10 transition-colors duration-500">
                  {table.getHeaderGroups().map((hg) =>
                    hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="px-6 py-4 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs whitespace-nowrap transition-colors"
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 bg-transparent transition-colors duration-500">
                <AnimatePresence>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-16 text-center text-slate-500 font-bold text-sm"
                      >
                        No records matched your search criteria.
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row, i) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        key={row.id}
                        className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/claims/${row.original.id}`)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/60 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-black/20 transition-colors duration-500">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Page{" "}
            <span className="text-slate-900 dark:text-white">
              {pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 dark:text-white">
              {totalPages || 1}
            </span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all border text-slate-700 dark:text-white bg-slate-200/50 dark:bg-white/10 border-slate-300/50 dark:border-white/10 ${pageIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-300/50 dark:hover:bg-white/20"}`}
            >
              Previous
            </button>
            <button
              onClick={() => setPageIndex((p) => p + 1)}
              disabled={pageIndex >= totalPages - 1}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all border text-slate-700 dark:text-white bg-slate-200/50 dark:bg-white/10 border-slate-300/50 dark:border-white/10 ${pageIndex >= totalPages - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-300/50 dark:hover:bg-white/20"}`}
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClaimsList;
