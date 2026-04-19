import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const ClaimForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: 'medical',
    description: '',
    documentName: '' // Simulating document metadata capture
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        documentMetadata: { fileName: formData.documentName, uploadDate: new Date().toISOString() }
      };
      await axiosInstance.post('/claims', payload);
      navigate('/claims');
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit a New Claim</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Claim Title / Incident Brief</label>
          <input type="text" name="title" required className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Claim Type</label>
          <select name="type" className="w-full p-2 border rounded" onChange={handleChange}>
            <option value="medical">Medical</option>
            <option value="vehicle">Vehicle / Auto</option>
            <option value="property">Property</option>
            <option value="general">General</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Incident Details</label>
          <textarea name="description" required rows="5" className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}></textarea>
        </div>

        {/* Simulating Document Attachment for the Metadata requirement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Document Reference</label>
          <input type="text" name="documentName" placeholder="e.g. Police_Report_01.pdf" className="w-full p-2 border rounded text-sm text-gray-500" onChange={handleChange} />
        </div>

        <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium">
          Submit Claim
        </button>
      </form>
    </div>
  );
};

export default ClaimForm;