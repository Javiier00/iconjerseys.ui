import { useState } from 'react';
import './App.css'

import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

import Dashboard from './components/Dashboard'
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'
import FutbolTeamsList from './components/FutbolTeamsList'
import ShirtsList from './components/ShirtsList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path='/login'
              element={
                <PublicRoute>
                  <LoginScreen />
                </PublicRoute>
              }
            />

            <Route
              path='/signup'
              element={
                <PublicRoute>
                  <SignupScreen />
                </PublicRoute>
              }
            />

            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path='/futbol-teams'
              element={
                <ProtectedRoute>
                  <FutbolTeamsList />
                </ProtectedRoute>
              }
            />

            <Route
              path='/shirts'
              element={
                <ProtectedRoute>
                  <ShirtsList />
                </ProtectedRoute>
              }
            />
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App;
