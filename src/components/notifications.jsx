import React, { useState } from 'react';
import { Bell, X } from 'lucide-react'; // Import icons from lucide-react

// Fake notification data for a website context
const fakeNotifications = [
  {
    id: 1,
    message: "Your bid is terminally accepted for the website redesign project!",
    timestamp: "2025-04-15 10:30 AM",
    type: "success",
    icon: "bell",
  },
  {
    id: 2,
    message: "A new comment on your blog post 'Top 10 Web Design Trends'.",
    timestamp: "2025-04-15 09:15 AM",
    type: "info",
    icon: "bell",
  },
  {
    id: 3,
    message: "Your website hosting plan will renew in 3 days.",
    timestamp: "2025-04-14 03:45 PM",
    type: "warning",
    icon: "bell",
  },
];

// WebsiteNotifications component
const WebsiteNotifications = () => {
  const [notifications, setNotifications] = useState(fakeNotifications);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  return (
    <div className="w-full max-w-sm p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-gray-600" />
          Notifications
        </h2>
        {notifications.length > 0 && (
          <span className="text-xs font-medium text-white bg-red-500 rounded-full px-2 py-1">
            {notifications.length}
          </span>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No new notifications</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-3 rounded-lg border transition-all duration-200 ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : notification.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    notification.type === 'success'
                      ? 'text-green-800'
                      : notification.type === 'warning'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                  }`}
                >
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      {notifications.length > 0 && (
        <button
          onClick={() => setNotifications([])}
          className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline focus:outline-none"
        >
          Clear all notifications
        </button>
      )}
    </div>
  );
};

export default WebsiteNotifications;