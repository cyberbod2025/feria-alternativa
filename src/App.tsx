/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';

// Public
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Handoff from './pages/public/Handoff';
import Feedback from './pages/public/Feedback';

// Student
import StudentHome from './pages/student/StudentHome';
import MapPage from './pages/student/MapPage';
import StandDetail from './pages/student/StandDetail';
import TourPage from './pages/student/TourPage';
import ProgressPage from './pages/student/ProgressPage';

// Teacher
import Dashboard from './pages/teacher/Dashboard';
import StandsList from './pages/teacher/StandsList';

const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/login", element: <Login /> },
      { path: "/auth/handoff", element: <Handoff /> },
      { path: "/feedback", element: <Feedback /> },

      {
        element: <StudentLayout />,
        children: [
          { path: "/inicio", element: <StudentHome /> },
          { path: "/mapa", element: <MapPage /> },
          { path: "/stand/:standId", element: <StandDetail /> },
          { path: "/recorrido", element: <TourPage /> },
          { path: "/progreso", element: <ProgressPage /> },
        ],
      },

      {
        path: "/docente",
        element: <TeacherLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "stands", element: <StandsList /> },
          { path: "visitantes", element: <div>Visitantes en construcción</div> },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
