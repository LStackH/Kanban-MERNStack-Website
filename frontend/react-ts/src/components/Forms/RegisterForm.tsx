import React from 'react'
import { registerUser } from '../../api/authApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

export function RegisterForm() {
    const navigate = useNavigate();
    const { login } = useAuth();  // <-- from AuthContext
  
    // Form fields
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    // Feedback state
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setError(null);
      setIsLoading(true);
  
      try {
        const data = await registerUser(username, email, password);
  
        if (data.token) {
          login(data.token);
        }
  
        // Redirect user after successful registration
        navigate("/");
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("Registration failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  
    return (
      <form
        onSubmit={handleRegister}
        className="max-w-sm mx-auto p-4 bg-gray-800 text-white rounded"
      >
        <h2 className="text-2xl mb-4">Register</h2>
  
        {error && <div className="mb-2 text-red-400">{error}</div>}
  
        <div className="mb-3">
          <label className="block mb-1">Username</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
  
        <div className="mb-3">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
  
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    );
  }