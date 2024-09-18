import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import ErrorPage from './foundation/ErrorPage.jsx';
import Root from './foundation/Root.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import Login from './pages/Authentication/Login/Login.jsx';
import Register from './pages/Authentication/Register/Register.jsx';
import ContextContainer from './context/ContextContainer.jsx';
import Parrent from '../test/Parrent.jsx';
import CreateNewPost from './pages/CreateNewPost/CreateNewPost.jsx';
import BlogView from './pages/BlogView/BlogView.jsx';
import Category from './pages/Category/Category.jsx';
import PrivateRoute from './PrivateRoute/PrivateRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/newPost",
        element: (<PrivateRoute>
          <CreateNewPost />
        </PrivateRoute>)
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/post/:id",
        element: <BlogView />
      },
      {
        path: "/category/:cateName",
        element: <Category />
      },
      {
        path: "/parrent",
        element: <Parrent />
      }
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextContainer>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <RouterProvider router={router} />
    </ContextContainer>
  </StrictMode>,
)
