import React from 'react';
import { useStore } from '../store';
import { Permission } from '../types';

interface PermissionGuardProps {
  requires: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  requires, 
  children, 
  fallback = null 
}) => {
  const { users, roles } = useStore();
  
  // In a real app, this would come from an auth context
  // For demo, we'll assume first user is logged in
  const currentUser = users[0];
  const userRole = roles.find(r => r.id === currentUser?.roleId);
  
  const hasPermission = requires.every(
    permission => userRole?.permissions.includes(permission)
  );

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};