import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Auth from "../components/auth/auth";
import Cookies from "universal-cookie";
import HomePage from "../pages/home-page/home-page";
import WorkspacesPage from "../pages/workspaces-page/workspaces-page";
import ContactsPage from "../pages/contacts-page/contacts-page";
import MessagesPage from "../pages/messages-page/messages-page";
import Header from "../components/header/header";
const cookies = new Cookies();

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<Auth />} />
    <Route
      path='/dashboard/'
      element={cookies.get("LOGIN-TOKEN") ? <HomePage /> : <Navigate to='/' />}
    />
    <Route
      path='/dashboard/workspaces'
      element={
        cookies.get("LOGIN-TOKEN") ? <WorkspacesPage /> : <Navigate to='/' />
      }
    />
    <Route
      path='/dashboard/contacts'
      element={
        cookies.get("LOGIN-TOKEN") ? <ContactsPage /> : <Navigate to='/' />
      }
    />
    <Route
      path='/dashboard/messages'
      element={
        cookies.get("LOGIN-TOKEN") ? <MessagesPage /> : <Navigate to='/' />
      }
    />
  </Routes>
);

const router = (
  <BrowserRouter>
    <Header />
    <AppRoutes />
  </BrowserRouter>
);

export default router;
