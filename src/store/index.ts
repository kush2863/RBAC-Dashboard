import { create } from 'zustand';
import { Role, User, Permission } from '../types';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

interface RBACStore {
  users: User[];
  roles: Role[];
  auditLogs: AuditLog[];
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addRole: (role: Role) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addAuditLog: (action: string, details: string) => void;
}

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    permissions: ['read', 'write', 'delete', 'admin'],
    description: 'Full system access'
  },
  {
    id: '2',
    name: 'Editor',
    permissions: ['read', 'write'],
    description: 'Can read and modify content'
  },
  {
    id: '3',
    name: 'Viewer',
    permissions: ['read'],
    description: 'Read-only access'
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    roleId: '1',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    roleId: '2',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    action: 'System Initialized',
    details: 'RBAC system initialized with default roles and users'
  }
];

export const useStore = create<RBACStore>((set) => ({
  users: initialUsers,
  roles: initialRoles,
  auditLogs: initialAuditLogs,
  addUser: (user) => set((state) => {
    const newState = { users: [...state.users, user] };
    state.addAuditLog('User Created', `New user ${user.name} added with role ${
      state.roles.find(r => r.id === user.roleId)?.name
    }`);
    return newState;
  }),
  updateUser: (id, updatedUser) => set((state) => {
    const newState = {
      users: state.users.map(user => user.id === id ? { ...user, ...updatedUser } : user)
    };
    state.addAuditLog('User Updated', `User ${updatedUser.name || id} modified`);
    return newState;
  }),
  deleteUser: (id) => set((state) => {
    const user = state.users.find(u => u.id === id);
    const newState = {
      users: state.users.filter(user => user.id !== id)
    };
    state.addAuditLog('User Deleted', `User ${user?.name || id} removed from system`);
    return newState;
  }),
  addRole: (role) => set((state) => {
    const newState = { roles: [...state.roles, role] };
    state.addAuditLog('Role Created', `New role ${role.name} added with ${role.permissions.length} permissions`);
    return newState;
  }),
  updateRole: (id, updatedRole) => set((state) => {
    const newState = {
      roles: state.roles.map(role => role.id === id ? { ...role, ...updatedRole } : role)
    };
    state.addAuditLog('Role Updated', `Role ${updatedRole.name || id} modified`);
    return newState;
  }),
  deleteRole: (id) => set((state) => {
    const role = state.roles.find(r => r.id === id);
    const newState = {
      roles: state.roles.filter(role => role.id !== id)
    };
    state.addAuditLog('Role Deleted', `Role ${role?.name || id} removed from system`);
    return newState;
  }),
  addAuditLog: (action: string, details: string) => set((state) => ({
    auditLogs: [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details
    }, ...state.auditLogs]
  }))
}));