import {ToastContainer} from "react-toastify"
import { Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from './page/Home';

import AuthRoute from "../routes/AuthRoute";
import ProtectedRoute from "../routes/ProtectedRoute";

function App() {
  return (
    <>
      <ToastContainer />
    <Routes>

      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      </Routes>
</>
      
  );
}

export default App;