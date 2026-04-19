import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const CreateOfficer = () => {
  const [officerData, setOfficerData] = useState({ name: '', email: '', password: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState({ type: '', text: '' });

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateMsg({ type: '', text: '' });

    try {
      const res = await axiosInstance.post('/admin/officer', officerData);
      setCreateMsg({ type: 'success', text: res.data.msg });
      setOfficerData({ name: '', email: '', password: '' }); // Clear form
    } catch (error) {
      setCreateMsg({ 
        type: 'error', 
        text: error.response?.data?.msg || "Failed to create officer." 
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-8 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Claims Officer</h2>
      <p className="text-sm text-gray-500 mb-8">
        Securely generate credentials for new Claims Officers. They will use this email and password to access the Officer Queue.
      </p>

      {createMsg.text && (
        <div className={`p-4 mb-6 rounded text-sm font-medium ${createMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {createMsg.text}
        </div>
      )}

      <form onSubmit={handleCreateOfficer} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            type="text"
            required
            placeholder="e.g. John Doe"
            value={officerData.name}
            onChange={(e) => setOfficerData({ ...officerData, name: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="officer@insurance.com"
            value={officerData.email}
            onChange={(e) => setOfficerData({ ...officerData, email: e.target.value })}
          />
        </div>
        <Input
          label="Temporary Password"
          type="password"
          required
          placeholder="Min. 8 characters"
          value={officerData.password}
          onChange={(e) => setOfficerData({ ...officerData, password: e.target.value })}
        />
        <div className="pt-4">
          <Button type="submit" className="w-full sm:w-auto" isLoading={isCreating}>
            Create Officer Account
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateOfficer;