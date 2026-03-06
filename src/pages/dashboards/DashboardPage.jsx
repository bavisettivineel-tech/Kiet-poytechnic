import { useAuth } from '../../contexts/AuthContext'
import AdminDashboard from './AdminDashboard'
import ManagementDashboard from './ManagementDashboard'
import StaffDashboard from './StaffDashboard'
import CTPOSDashboard from './CTPOSDashboard'
import StudentDashboard from './StudentDashboard'

export default function DashboardPage() {
    const { user } = useAuth()

    switch (user?.role) {
        case 'admin':
            return <AdminDashboard />
        case 'management':
            return <ManagementDashboard />
        case 'administrative_staff':
            return <StaffDashboard />
        case 'ctpos':
            return <CTPOSDashboard />
        case 'student':
            return <StudentDashboard />
        default:
            return <AdminDashboard />
    }
}
