import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ExpensesTracker from './ExpensesTracker';
import { Button } from '@/components/ui/button.tsx';

const AuthProvider: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  if (!isAuthenticated) {
    return (
      <div>
        {showRegister ? (
          <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
        <Button onClick={() => setShowRegister(!showRegister)} className='mt-4'>
          {showRegister ? 'Back to Login' : 'Register'}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleLogout}
        className='mb-4 rounded bg-red-500 px-4 py-2 text-white'
      >
        Logout
      </button>
      <ExpensesTracker />
    </div>
  );
};

export default AuthProvider;
