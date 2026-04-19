import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import Button from '../../components/ui/Button';

const ClaimDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [claim, setClaim] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // FIX: Use proper endpoint to fetch one claim
  const fetchClaimData = useCallback(async () => {
    const res = await axiosInstance.get(`/claims/${id}`);
    return res.data;
  }, [id]);

  const fetchCommentsData = useCallback(async () => {
    const res = await axiosInstance.get(`/claims/comment/${id}`);
    return res.data;
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        const [claimData, commentsData] = await Promise.all([
          fetchClaimData(),
          fetchCommentsData()
        ]);
        if (isMounted) {
          setClaim(claimData);
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    loadInitialData();
    return () => { isMounted = false; };
  }, [fetchClaimData, fetchCommentsData]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/claims/comment', { message: newComment, claimId: id });
      setNewComment('');
      const updatedComments = await fetchCommentsData();
      setComments(updatedComments);
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await axiosInstance.put(`/claims/${id}`, { status });
      const updatedClaim = await fetchClaimData();
      setClaim(updatedClaim);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // NEW: Officer Assignment
  const handleSelfAssign = async () => {
    try {
      await axiosInstance.put(`/claims/${id}/assign`, { officerId: user.id });
      const updatedClaim = await fetchClaimData();
      setClaim(updatedClaim);
    } catch (error) {
       console.error("Failed to assign officer", error);
    }
  };

  if (!claim) return <div className="p-8 text-center text-gray-500">Loading claim details...</div>;

  return (
    <div className="p-6 bg-white rounded shadow-sm max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{claim.title}</h2>
          <p className="text-sm text-gray-500 mt-1">Submitted by: {claim.user?.name} on {new Date(claim.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider
          ${claim.status === 'approved' || claim.status === 'settled' ? 'bg-green-100 text-green-800' : 
            claim.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {claim.status}
        </span>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border mb-6">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Incident Details</h4>
        <p className="text-gray-700 whitespace-pre-wrap">{claim.description}</p>
        {claim.documentMetadata && (
          <div className="mt-4 pt-4 border-t text-sm text-gray-600">
            <strong>Attached Document:</strong> {claim.documentMetadata.fileName}
          </div>
        )}
      </div>
      
      {/* Officer & Status Controls */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-md flex flex-wrap items-center gap-6">
        <div>
          <span className="text-sm font-semibold text-gray-700 block mb-1">Assigned Officer:</span>
          <span className="text-gray-900">{claim.assignedOfficer?.name || 'Unassigned'}</span>
        </div>

        {(user.role === 'officer') && !claim.assignedOfficer && (
           <Button variant="outline" className="bg-white text-sm py-1" onClick={handleSelfAssign}>Assign to Me</Button>
        )}

        {(user.role === 'officer') && (
          <div className="ml-auto">
            <span className="text-sm font-semibold text-gray-700 block mb-1">Update Status:</span>
            <select 
              className="border p-2 rounded text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleUpdateStatus(e.target.value)}
              value={claim.status}
            >
              <option value="submitted">Submitted</option>
              <option value="under review">Under Review</option>
              <option value="additional info required">Need Info</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="settled">Settled</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Timeline Updates</h3>
        <div className="space-y-4 mb-6">
          {comments.length === 0 && <p className="text-sm text-gray-500">No updates yet.</p>}
          {comments.map((c) => (
            <div key={c.id} className="p-4 bg-gray-50 rounded border flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-700">{c.user?.name || 'System'}</span>
                <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-700 text-sm">{c.message}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="flex gap-3">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Type a new update, comment, or request..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <Button type="submit">Post Update</Button>
        </form>
      </div>
    </div>
  );
};

export default ClaimDetails;