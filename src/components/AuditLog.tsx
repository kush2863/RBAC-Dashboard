import React from 'react';
import { useStore } from '../store';
import { Activity } from 'lucide-react';

export const AuditLog: React.FC = () => {
  const { auditLogs } = useStore();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-gray-500" />
          Activity Log
        </h2>
      </div>
      <div className="overflow-auto max-h-64">
        <ul className="divide-y divide-gray-200">
          {auditLogs.map((log) => (
            <li key={log.id} className="p-4 hover:bg-gray-50">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{log.action}</h3>
                    <p className="text-sm text-gray-500">{log.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-500">{log.details}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};