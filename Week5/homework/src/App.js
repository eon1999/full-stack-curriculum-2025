// Import necessary modules from their respective packages
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./contexts/AuthContext"; // Custom context for authentication
import HomePage from "./components/HomePage"; // Component for the homepage
import LoginPage from "./components/LoginPage"; // Component for the login page
import { CssBaseline } from "@mui/material"; // For consistent baseline styling
import theme from "./Theme"; // Custom theme settings

const BASE_URL = "https://tpeo-todo.vercel.app";

// Helper: perform fetch and return json OR throw error
async function request(path, options = {}) {
  // call fetch with full URL
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json"},
    ...options
  });
  
  // if response not ok, try to read body for a better error
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} - ${text}`)
  }

  // response is ok, try to parse json, but some responses return null
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function getTasks() {
  return request("/tasks");
}

export async function createTask(task) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(task), // send task as JSON
  });
}

export async function updateTask(id, task) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task), // update payload
  });
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
}

// The main App component
function App() {
  return (
    // The Router component from react-router-dom helps in handling different routes or pages
    <Router>
      {/* CssBaseline is a component from MUI. It helps in providing consistent baseline styling across different browsers. */}
      <CssBaseline/>
      {/* TODO: AuthProvider is a custom context component that provides authentication functionalities to its children. */}
      
        {/* ThemeProvider from MUI provides theming capabilities. We pass our custom theme to it. */}
        <ThemeProvider theme={theme}>
          {/* Routes is a component from react-router-dom that wraps all possible routes or pages */}
          <Routes>
            {/* Route represents a single route. Here, we define two routes: one for login and one for home. */}
            {/* The path prop determines the URL path, and the element prop determines which component to show. */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </ThemeProvider>
      
    </Router>
  );
}

export default App;