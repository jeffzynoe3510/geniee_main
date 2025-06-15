import { getCurrentUser } from '../actions/auth';
import { redirect } from 'next/navigation';

export default async function SkinAnalysis() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Skin Analysis</h1>
        <div>
          <p>Welcome to your personalized skin analysis experience!</p>
        </div>
      </div>
    </main>
  );
} 