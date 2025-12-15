import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthCOntext'
import ProtectedRoute from './components/ProtectedRoute'
import Start from './pages/Start'
import AddHabit from './pages/AddHabit'
import Profile from './pages/Profile'
import Leaderboard from './pages/LeaderBoard'
const App = () => {
  return (

      <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/' element={<Start/>}/>
      <Route path='/habit/create' element={<AddHabit/>}/>
      <Route path= '/profile' element={<Profile/>}/>
      <Route path='/leaderboard' element={<Leaderboard />}/>
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  </AuthProvider>
  )
}

export default App