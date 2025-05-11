import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth(); // Get currentUser to redirect if already logged in
  // const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (currentUser) {
  //     navigate('/'); // Redirect to home or dashboard if already logged in
  //   }
  // }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await login(email, password);
      // No explicit success message here, App.jsx will redirect to Dashboard
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.detail) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl card-hover-effect"> {/* Dark theme card */}
      <h2 className="text-3xl font-bold text-center text-purple-400">Welcome Back</h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="block w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="block w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-50 transform hover:scale-105 transition-all duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        {message && (
          <p className="mt-2 text-center text-sm text-red-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;