import React from "react";
import "./App.scss";
import Register from "./components/auth/register/register";
import Login from "./components/auth/login/login";
import { RouterProvider } from "react-router-dom";
import router from "./config/routes";

function App() {
  return <div className='App'>{router}</div>;
}

export default App;
