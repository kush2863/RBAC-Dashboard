import React, { useState } from 'react';
import { UserList } from './components/UserList';
import { RoleList } from './components/RoleList';
import { UserForm } from './components/UserForm';
import { RoleForm } from './components/RoleForm';
import { AuditLog } from './components/AuditLog';
import { PermissionGuard } from './components/PermissionGuard';
import { User, Role } from './types';
import { Users, ShieldCheck, Plus, Activity, Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [editingRole, setEditingRole] = useState<Role | undefined>();
  const [showUserForm, setShowUserForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile-first navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-indigo-600 flex-shrink-0" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 truncate">RBAC Dashboard</span>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'roles'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Roles
              </button>
              <button
                onClick={() => setShowAuditLog(!showAuditLog)}
                className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                <Activity className="h-4 w-4 mr-2" />
                Activity Log
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1 px-4">
            <button
              onClick={() => {
                setActiveTab('users');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'users'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Users
            </button>
            <button
              onClick={() => {
                setActiveTab('roles');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'roles'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <ShieldCheck className="h-5 w-5 mr-3" />
              Roles
            </button>
            <button
              onClick={() => {
                setShowAuditLog(!showAuditLog);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              <Activity className="h-5 w-5 mr-3" />
              Activity Log
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeTab === 'users' ? 'User Management' : 'Role Management'}
            </h1>
            <PermissionGuard requires={['write']}>
              <button
                onClick={() => activeTab === 'users' ? setShowUserForm(true) : setShowRoleForm(true)}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {activeTab === 'users' ? 'User' : 'Role'}
              </button>
            </PermissionGuard>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className={`${showAuditLog ? 'xl:col-span-3' : 'xl:col-span-4'}`}>
              {activeTab === 'users' ? (
                <UserList
                  onEdit={(user) => {
                    setEditingUser(user);
                    setShowUserForm(true);
                  }}
                />
              ) : (
                <RoleList
                  onEdit={(role) => {
                    setEditingRole(role);
                    setShowRoleForm(true);
                  }}
                />
              )}
            </div>
            {showAuditLog && (
              <div className="xl:col-span-1">
                <AuditLog />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(undefined);
          }}
        />
      )}

      {showRoleForm && (
        <RoleForm
          role={editingRole}
          onClose={() => {
            setShowRoleForm(false);
            setEditingRole(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;