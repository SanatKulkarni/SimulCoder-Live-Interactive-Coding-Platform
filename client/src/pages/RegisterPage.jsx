import React from 'react';
import RegisterFormComponent from '../components/Auth/Register.jsx'; // Assuming Register.jsx is the form component
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex flex-col justify-center items-center p-4">
       <div className="absolute top-5 left-5">
        <Link to="/" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200">
          &larr; Back to Home
        </Link>
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Simul<span className="text-purple-400">Coder</span>
          </h1>
          <p className="text-gray-400 mt-2">Create your account to start collaborating.</p>
        </div>
        <RegisterFormComponent /> {/* This is your existing Register.jsx component */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;