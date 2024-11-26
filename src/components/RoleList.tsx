import React, { useState, useMemo } from 'react';
import { Role } from '../types';
import { Edit2, Trash2, Shield, Search, ChevronUp, ChevronDown, Lock } from 'lucide-react';
import { useStore } from '../store';
import { useDebounce } from '../hooks/useDebounce';

interface RoleListProps {
  onEdit: (role: Role) => void;
}

type SortField = 'name' | 'permissions';

export const RoleList: React.FC<RoleListProps> = ({ onEdit }) => {
  const { roles, deleteRole } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 300);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [permissionFilter, setPermissionFilter] = useState<string>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedRoles = useMemo(() => {
    return roles
      .filter(role => {
        const matchesSearch = 
          role.name.toLowerCase().includes(search.toLowerCase()) ||
          role.description.toLowerCase().includes(search.toLowerCase());
        const matchesPermission = permissionFilter === 'all' || 
          role.permissions.includes(permissionFilter as any);
        return matchesSearch && matchesPermission;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'permissions':
            comparison = a.permissions.length - b.permissions.length;
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [roles, search, sortField, sortDirection, permissionFilter]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline-block ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline-block ml-1" />;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search roles..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 w-full h-11 rounded-lg border border-gray-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <select
          value={permissionFilter}
          onChange={(e) => setPermissionFilter(e.target.value)}
          className="h-11 w-full rounded-lg border border-gray-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">All Permissions</option>
          <option value="read">Read</option>
          <option value="write">Write</option>
          <option value="delete">Delete</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Role <SortIcon field="name" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('permissions')}
              >
                Permissions <SortIcon field="permissions" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedRoles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{role.name}</div>
                      <div className="text-sm text-gray-500">{role.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        <Lock className="mr-1 h-3 w-3" />
                        {permission}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => onEdit(role)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteRole(role.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAndSortedRoles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="h-8 w-8 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{role.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Permissions
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      <Lock className="mr-1 h-3 w-3" />
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 bg-gray-50">
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                <button
                  onClick={() => onEdit(role)}
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-gray-100 transition-colors"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => deleteRole(role.id)}
                  className="flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};