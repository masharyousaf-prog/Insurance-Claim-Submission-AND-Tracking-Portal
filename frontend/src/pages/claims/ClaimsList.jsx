import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const ClaimsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Server-Side States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sort, setSort] = useState('DESC');
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/claims', {
        params: { 
          search, 
          status: statusFilter, 
          type: typeFilter,
          sort,
          page: pageIndex + 1,
          limit: pageSize
        }
      });
      setData(res.data.data ? res.data.data : res.data);
      setTotalPages(res.data.lastPage || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, sort, pageIndex]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [search, statusFilter, typeFilter, sort]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const columns = useMemo(() => [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Title', accessorKey: 'title' },
    { header: 'Type', accessorKey: 'type', cell: info => <span className="capitalize">{info.getValue()}</span> },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: info => {
        const val = info.getValue() || 'submitted';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
            ${val === 'approved' || val === 'settled' ? 'bg-green-100 text-green-800' : 
              val === 'rejected' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'}`}>
            {val}
          </span>
        )
      }
    },
    { header: 'Applicant', accessorFn: row => row.user?.name || 'Unknown' },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: info => new Date(info.getValue()).toLocaleDateString()
    },
    {
      id: 'actions',
      cell: info => (
        <button 
          onClick={() => navigate(`/claims/${info.row.original.id}`)}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          View Details
        </button>
      )
    }
  ], [navigate]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Claims Queue</h2>
      
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded shadow-sm">
        <input 
          type="text" 
          placeholder="Search by title..." 
          className="p-2 border rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="p-2 border rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="under review">Under Review</option>
          <option value="additional info required">Info Required</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="settled">Settled</option>
        </select>
        <select className="p-2 border rounded" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="medical">Medical</option>
          <option value="vehicle">Vehicle</option>
          <option value="property">Property</option>
          <option value="general">General</option>
        </select>
        <select className="p-2 border rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </select>
      </div>

      <div className="bg-white rounded shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading claims...</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 border-b">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 font-semibold">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan="7" className="p-4 text-center text-gray-500">No claims found.</td></tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between px-2 mt-4">
        <span className="text-sm text-gray-600">
          Page {pageIndex + 1} of {totalPages || 1}
        </span>
        <div className="space-x-2">
          <button 
            onClick={() => setPageIndex(p => Math.max(0, p - 1))} 
            disabled={pageIndex === 0}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 bg-white text-sm"
          >
            Previous
          </button>
          <button 
            onClick={() => setPageIndex(p => p + 1)} 
            disabled={pageIndex >= totalPages - 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 bg-white text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimsList;