"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/auth-context';

export default function SetUsernamePage() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateUsername = async (username: string) => {
    if (!username) {
      setError('Username is required.');
      return false;
    }
    if (username !== username.toLowerCase()) {
      setError('Username must be lowercase.');
      return false;
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      setError('Username can only contain lowercase letters, numbers, and underscores.');
      return false;
    }
    if (username.includes(' ')) {
      setError('Username cannot contain spaces.');
      return false;
    }
    // Check uniqueness
    const supabase = createClient();
    const { data } = await supabase.from('profiles').select('id').eq('username', username);
    if (data && data.length > 0) {
      setError('Username is already taken.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('User not loaded. Please log in again.');
      return;
    }
    setLoading(true);
    if (!(await validateUsername(username))) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { error: updateError } = await supabase.from('profiles').update({ username }).eq('id', user.id);
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    await refreshUser();
    router.replace('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="bg-card shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-2">Set Your Username</h1>
        <p className="text-muted-foreground text-center text-sm mb-2">Choose a unique username to use Nekopress. Only lowercase letters, numbers, and underscores are allowed.</p>
        <Input
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value.toLowerCase())}
          className="text-center text-lg"
          maxLength={32}
          autoFocus
        />
        {error && <div className="text-red-500 text-xs text-center">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading || !user}>{loading ? 'Saving...' : 'Save Username'}</Button>
        {!user && <div className="text-red-500 text-xs text-center mt-2">User not loaded. Please log in again.</div>}
      </form>
    </div>
  );
} 