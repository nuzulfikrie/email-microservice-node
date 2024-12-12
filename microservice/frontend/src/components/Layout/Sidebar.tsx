import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  EnvelopeIcon,
  DocumentIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Templates', href: '/templates', icon: DocumentIcon },
  { name: 'Send Email', href: '/send', icon: EnvelopeIcon },
  { name: 'Scheduled', href: '/scheduled', icon: ClockIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold">Mail Service</h1>
      </div>
      <nav className="mt-8">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 ${
                isActive ? 'bg-gray-900' : 'hover:bg-gray-700'
              }`}
            >
              <item.icon className="h-6 w-6 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}; 