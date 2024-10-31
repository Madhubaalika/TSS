import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-primary">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        
        {/* Event Details */}
        <Link to="/admin-dashboard/event-details" className="dashboard-card">
          <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">Event Details</h2>
            <p className="text-gray-600">View and edit event details.</p>
          </div>
        </Link>

        {/* Booth Map */}
        <Link to="/admin-dashboard/booth-map" className="dashboard-card">
          <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">Booth Map</h2>
            <p className="text-gray-600">View and manage booth layout.</p>
          </div>
        </Link>

        {/* Volunteer Salary Payment */}
        <Link to="/admin-dashboard/volunteer-salary" className="dashboard-card">
          <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">Volunteer Salary Pay</h2>
            <p className="text-gray-600">Manage volunteer payments.</p>
          </div>
        </Link>

        {/* Calendar */}
        <Link to="/admin-dashboard/calendar" className="dashboard-card">
          <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">Calendar</h2>
            <p className="text-gray-600">View event schedule and timelines.</p>
          </div>
        </Link>

        {/* View Feedbacks */}
        <Link to="/admin-dashboard/feedbacks" className="dashboard-card">
          <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">Feedbacks</h2>
            <p className="text-gray-600">View feedbacks from attendees.</p>
          </div>
        </Link>
        
      </div>
    </div>
  );
}
