'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/database';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function UpdatePasswordPage() {
    const supabase = createBrowserClient();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        if (!password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields.');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }

        return true;
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            toast.error(error.message || 'Failed to update password');
            setLoading(false);
        } else {
            toast.success('Password updated successfully');
            setLoading(false);
            router.push('/auth/register'); // redirect after update
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <form
                onSubmit={handleUpdatePassword}
                className="max-w-md w-full space-y-6 glass rounded-lg border p-6 shadow"
            >
                <h1 className="text-2xl font-bold text-center">Update Your Password</h1>
                <p className="text-sm text-muted-foreground text-center">
                    Please enter your new password below.
                </p>

                {/* Error Display */}
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div
                    className='relative'
                >
                    <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New password"
                        value={password}
                        disabled={loading}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full glass focus:outline-1 outline-primary rounded-xl p-2.5 text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div
                    className='relative'
                >
                    <Input
                        name="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        disabled={loading}
                        value={confirmPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full glass focus:outline-1 outline-primary rounded-xl p-2.5 text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </Button>
            </form>
        </div>
    );
}
