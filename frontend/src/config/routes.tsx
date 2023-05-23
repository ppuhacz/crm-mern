import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Auth from "../components/auth/auth";
import Crm from "../components/crm/crm";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<Auth />} />
    <Route
      path='/crm'
      element={cookies.get("LOGIN-TOKEN") ? <Crm /> : <Navigate to='/' />}
    />
  </Routes>
);

const router = (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default router;
