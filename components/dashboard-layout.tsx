'use client';

import { useAuth } from '@/hooks/use-auth';
import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, BookOpen, User, LogOut, Menu, FileText, Settings, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { icon: BookOpen, label: 'Alumnos', href: '/dashboard/alumnos', roles: ['admin', 'secretaria', 'maestro'] },
    { icon: Users, label: 'Maestros', href: '/dashboard/maestros', roles: ['admin', 'secretaria'] },
    { icon: BookOpen, label: 'Aulas', href: '/dashboard/aulas', roles: ['admin', 'secretaria'] },
    { icon: Users, label: 'Progenitores', href: '/dashboard/progenitores', roles: ['admin', 'secretaria'] },
    { icon: GraduationCap, label: 'Cursos', href: '/dashboard/cursos', roles: ['admin', 'secretaria', 'maestro'] },
    { icon: FileText, label: 'Reportes', href: '/dashboard/reports', roles: ['admin', 'secretaria'] },
    { icon: Settings, label: 'Usuarios', href: '/dashboard/usuarios', roles: ['admin'] },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    user && item.roles.includes(user.Role) ? true : false
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <h1 className="text-xl font-bold text-gray-900">Catequesis</h1>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user?.FullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.Role}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.Email}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
