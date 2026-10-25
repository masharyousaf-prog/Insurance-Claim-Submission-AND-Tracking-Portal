import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/register', { ...formData, role: 'policyholder' });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-transparent overflow-hidden px-4">
      <div className="w-full max-w-md">
        <Card delay={0}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm transition-colors duration-500">Create Account</h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-500">Register to submit and track your claims</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <Input label="Full Name" type="text" name="name" placeholder="Jane Doe" required onChange={handleChange} />
            <Input label="Email Address" type="email" name="email" placeholder="name@company.com" required onChange={handleChange} />
            <Input label="Password" type="password" name="password" placeholder="Min. 8 characters" required onChange={handleChange} />
            
            <div className="pt-4">
              <Button type="submit" className="w-full py-3.5 text-base" isLoading={isLoading}>
                Create Account
              </Button>
            </div>
          </form>

          <p className="mt-8 text-sm font-bold text-center text-slate-500 dark:text-slate-400 transition-colors duration-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 hover:underline transition-colors">
              Sign in here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;