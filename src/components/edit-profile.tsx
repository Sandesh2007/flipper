// components/EditProfileModal.tsx
'use client'

import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import { useAuth } from './auth-context'
import Image from 'next/image'

export default function EditProfile() {
    const { user, refreshUser } = useAuth();
    const supabase = createClient();
    // const [image, setImage] = useState(user?.avatar_url || '');
    const [open, setOpen] = useState(false);
    const [bio, setBio] = useState(user?.bio || '');
    const [username, setUsername] = useState(user?.username || '');

    useEffect(() => {
        if (user) {
          setUsername(user.username || '');
          setBio(user.bio || '');
        //   setImage(user.avatar_url || '');
        }
      }, [user]);

      const updateProfile = async () => {
        if (!user?.id) return;
      
        const { error } = await supabase
          .from('profiles')
          .update({
            username,
            bio,
            // avatar_url: image,
          })
          .eq('id', user.id);
      
        if (error) {
          toast.error('Failed to update profile');
        } else {
          toast.success('Profile updated');
        }
      };
      

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                </Button>
            </DialogTrigger>

            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <div className='flex justify-between items-center'>
                    <span>Session</span>
                    <Button
                        onClick={async (e) => {
                            e.preventDefault()
                            toast.promise(supabase.auth.signOut(), {
                                loading: 'Logging out...',
                                success: 'Logged out successfully',
                                error: 'Failed to log out'
                            })
                            window.location.href = '/'
                        }}
                        variant="destructive">
                        <span>Logout</span>
                    </Button>
                </div>

                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                            Name
                        </Label>
                        <Input
                            id="name"
                            className="bg-background border border-input rounded-xl px-4 py-2 text-sm"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium text-muted-foreground">
                            Bio
                        </Label>
                        <Input
                            id="bio"
                            className="bg-background border border-input rounded-xl px-4 py-2 text-sm"
                            placeholder="Short description about you"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image" className="text-sm font-medium text-muted-foreground">
                            Profile Image URL
                        </Label>
                        <Input
                            id="image"
                            className="bg-background border border-input rounded-xl px-4 py-2 text-sm"
                            placeholder="https://..."
                            // value={image}
                            // onChange={e => setImage(e.target.value)}
                        />
                        {/* {image && ( */}
                            <div className="mt-2">
                                <Label className="text-sm text-muted-foreground mb-1 block">Preview</Label>
                                <Image
                                    src={user?.avatar_url || ''}
                                    alt="Profile Preview"
                                    className="w-24 h-24 rounded-full object-cover border"
                                />
                            </div>
                        {/* )} */}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={async () => {
                            toast.promise(
                                updateProfile()
                                .catch((error) => {
                                    toast.error(error.message)
                                    throw error
                                }),
                                {
                                    loading: 'Updating profile...',
                                    success: 'Profile updated',
                                    error: 'Failed to update profile',
                                }
                            );
                            toast.promise(
                                refreshUser(),
                                {
                                    loading: 'Refreshing user...',
                                    success: 'User refreshed',
                                    error: 'Failed to refresh user',
                                }
                            );
                            setOpen(false);
                        }}
                    >
                        Save
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
