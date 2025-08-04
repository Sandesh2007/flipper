"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/database/supabase/client';
import { useAuth } from '@/components';
import { toast } from 'react-hot-toast';

export default function SetUsernamePage() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  // Wait for user to load
  useEffect(() => {
    if (user !== undefined) {
      setUserLoading(false);
    }
  }, [user]);

  const validateUsername = async (username: string) => {
    if (!username) {
      setError('Username is required.');
      return false;
    }
    if (username !== username.toLowerCase()) {
      setError('Username must be lowercase.');
      return false;
    }
    if (!/^[a-z0-9_\s]+$/.test(username)) {
      setError('Username can only contain lowercase letters, numbers, underscores, and spaces.');
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
    
    console.log('Starting username save process...');
    setLoading(true);
    setError('');
    
    try {
      // Validate username first
      console.log('Validating username:', username);
      if (!(await validateUsername(username))) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      
      // First, check if profile exists
      console.log('Checking if profile exists...');
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Error other than "not found"
        console.error('Error fetching profile:', fetchError);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      let result;
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile...');
        result = await supabase
          .from('profiles')
          .update({ username })
          .eq('id', user.id);
      } else {
        // Create new profile for new Google users
        console.log('Creating new profile...');
        result = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username,
            email: user.email,
            avatar_url: user.avatar_url,
            bio: user.bio,
            location: user.location,
          });
      }

      if (result.error) {
        console.error('Database error:', result.error);
        setError(result.error.message);
        setLoading(false);
        return;
      }

      console.log('Username saved successfully!');
      // Show success message
      toast.success('Username saved successfully!');
      
      // Wait a moment for the database to update
      console.log('Waiting for database update...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to refresh user data, but don't wait too long
      console.log('Refreshing user data...');
      try {
        await Promise.race([
          refreshUser(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]);
        console.log('User data refreshed successfully');
      } catch (refreshError) {
        console.warn('User refresh timed out, continuing anyway:', refreshError);
      }
      
      // Navigate to home page
      console.log('Navigating to home page...');
      router.replace('/home/publisher');
      
    } catch (err) {
      console.error('Error setting username:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">You need to be logged in to set a username.</p>
          <Button onClick={() => router.push('/auth/register')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="bg-card shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-2">Set Your Username</h1>
        <p className="text-muted-foreground text-center text-sm mb-2">
          This will be your public profile URL.
          <br />
          <br />
          <span className="text-xs text-muted-foreground">
            Example: https://flipper.vercel.app/profile/username
          </span>
        </p>
        <Input
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value.toLowerCase())}
          className="text-center text-lg"
          maxLength={32}
          autoFocus
          disabled={loading}
        />
        {error && <div className="text-red-500 text-xs text-center">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Username'}
        </Button>
      </form>
    </div>
  );
} 