import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = isLogin ? login(username, password) : register(username, password);

    if (!success) {
      setError(isLogin ? 'Invalid credentials' : 'Username already exists');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Crok</h1>
          <p className="text-gray-600">Simple document sharing</p>
        </div>

        <div className="border border-black p-8">
          <div className="flex mb-6 border-b border-gray-300">
            <button
              className={`flex-1 pb-2 ${isLogin ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 pb-2 ${!isLogin ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
