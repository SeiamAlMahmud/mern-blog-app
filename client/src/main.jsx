import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './foundation/ErrorPage.jsx';
import Root from './foundation/Root.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import Login from './pages/Authentication/Login/Login.jsx';
import Register from './pages/Authentication/Register/Register.jsx';
import ContextContainer from './context/ContextContainer.jsx';
import Parrent from '../test/Parrent.jsx';

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
        path: "/register",
        element: <Register />
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
    <RouterProvider router={router} />
    </ContextContainer>
  </StrictMode>,
)
