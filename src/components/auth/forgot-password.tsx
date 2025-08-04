'use client'
import React, { useState } from 'react'
import { createBrowserClient } from '@/lib/database'
import { Button } from '../ui/button';
import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '../ui/dialog';
import { Mail } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const supabase = createBrowserClient();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('Please enter your email');
            return;
        }

        const {error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/update-password` });
        if (error) {
            toast.error("An error occurred while resetting your password");
            toast.error(error.message);
        } else {
            toast.success('Password reset email sent');
            setOpen(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <Mail className="h-4 w-4 mr-2" />
                    Forgot Password
                </Button>
            </DialogTrigger>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>
                        Enter your email to reset your password
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4' >
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type='email'
                            className="w-full glass border border-input rounded-xl px-4 py-2 text-sm"
                            placeholder='Enter your email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="outline"
                        type="submit"
                        className='cursor-pointer'
                    >Reset Password</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
