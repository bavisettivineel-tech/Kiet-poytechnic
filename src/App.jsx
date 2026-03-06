import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/dashboards/DashboardPage'
import StudentsPage from './pages/students/StudentsPage'
import AttendancePage from './pages/attendance/AttendancePage'
import MarksPage from './pages/marks/MarksPage'
import FeesPage from './pages/fees/FeesPage'
import TransportPage from './pages/transport/TransportPage'
import NoticesPage from './pages/notices/NoticesPage'
import StaffPage from './pages/staff/StaffPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import SettingsPage from './pages/settings/SettingsPage'
import IDCardsPage from './pages/idcards/IDCardsPage'
import ReportsPage from './pages/reports/ReportsPage'
import MyAttendancePage from './pages/student/MyAttendancePage'
import MyMarksPage from './pages/student/MyMarksPage'
import MyFeesPage from './pages/student/MyFeesPage'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Student Management - all roles except student */}
        <Route
          path="students"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management', 'administrative_staff', 'ctpos']}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />

        {/* Attendance - admin, ctpos */}
        <Route
          path="attendance"
          element={
            <ProtectedRoute allowedRoles={['admin', 'ctpos']}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        {/* Internal Marks - admin, ctpos */}
        <Route
          path="marks"
          element={
            <ProtectedRoute allowedRoles={['admin', 'ctpos']}>
              <MarksPage />
            </ProtectedRoute>
          }
        />

        {/* Fee Management - admin, management, administrative_staff */}
        <Route
          path="fees"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management', 'administrative_staff']}>
              <FeesPage />
            </ProtectedRoute>
          }
        />

        {/* Transport - admin, management */}
        <Route
          path="transport"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <TransportPage />
            </ProtectedRoute>
          }
        />

        {/* Notices - all roles */}
        <Route path="notices" element={<NoticesPage />} />

        {/* Staff Management - admin only */}
        <Route
          path="staff"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StaffPage />
            </ProtectedRoute>
          }
        />

        {/* Analytics - admin, management */}
        <Route
          path="analytics"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Settings - admin only */}
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* ID Cards - management */}
        <Route
          path="id-cards"
          element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <IDCardsPage />
            </ProtectedRoute>
          }
        />

        {/* Reports - administrative_staff */}
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={['admin', 'administrative_staff']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Student-specific routes */}
        <Route
          path="my-attendance"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MyAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-marks"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MyMarksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-fees"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MyFeesPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
