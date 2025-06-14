'use client';

import ProtectedRoute from './ProtectedRoute';

export default function withAuth(Component, options = {}) {
  return function WithAuth(props) {
    return (
      <ProtectedRoute
        requiredRole={options.requiredRole}
        fallback={options.fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
} 