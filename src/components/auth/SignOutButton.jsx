import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignOutButton({ className = '' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to sign out');
      }

      // Redirect to sign-in page
      router.push('/auth/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      // You might want to show an error toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 ${className}`}
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
} 