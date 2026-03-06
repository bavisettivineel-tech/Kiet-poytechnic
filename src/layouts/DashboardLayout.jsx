import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-bg">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
                <TopBar />
                <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
