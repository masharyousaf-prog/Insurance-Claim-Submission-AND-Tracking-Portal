import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { setCredentials } from "../../features/authSlice";
import axiosInstance from "../../api/axiosInstance";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        })
      );
      toast.success(`Welcome back, ${response.data.user.name.split(' ')[0]}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-transparent overflow-hidden px-4">
      <div className="w-full max-w-md">
        {/* We use our adaptive Card component to handle the glassmorphism seamlessly! */}
        <Card delay={0}>
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_8px_20px_rgba(59,130,246,0.3)] dark:shadow-[0_8px_20px_rgba(34,211,238,0.2)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm transition-colors duration-500">InsureTrack</h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-500">Secure access to your claims portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="pt-2">
              <Button type="submit" className="w-full py-3.5 text-base" isLoading={isLoading}>
                Sign In to Portal
              </Button>
            </div>
          </form>

          <p className="mt-8 text-sm font-bold text-center text-slate-500 dark:text-slate-400 transition-colors duration-500">
            New to the platform?{" "}
            <Link to="/register" className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 hover:underline transition-colors">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;