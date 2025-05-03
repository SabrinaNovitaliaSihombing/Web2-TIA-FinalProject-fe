import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./utils/AuthProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoteList from './pages/NoteList';
import NoteDetail from './pages/NoteDetail';
import NoteForm from './components/NoteForm';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import TaskForm from './components/TaskForm';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryList from './pages/CategoryList';
import CategoryForm from './components/CategoryForm';
import CategoryDetail from './pages/CategoryDetail';

import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import BaseLayout from "./layouts/BaseLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route path="/" element={<Home />} />

              {/* Note Routes */}
              <Route path="/notes" element={<NoteList />} />
              <Route path="/notes/new" element={<NoteForm />} />
              <Route path="/notes/:id" element={<NoteDetail />} />
              <Route path="/notes/:id/edit" element={<NoteForm isEdit />} />

              {/* Task Routes */}
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/new" element={<TaskForm />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/tasks/:id/edit" element={<TaskForm isEdit />} />

              {/* Category Routes */}
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories/new" element={<CategoryForm />} />
              <Route path="/categories/:id" element={<CategoryDetail />} />
              <Route path="/categories/:id/edit" element={<CategoryForm isEdit />} />
            </Route>

            <Route path="/" element={<BaseLayout />}>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider >
    </QueryClientProvider >
  );
}

export default App;
