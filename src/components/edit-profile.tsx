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
import { v4 as uuidv4 } from 'uuid';

export default function EditProfile() {
    const { user, refreshUser } = useAuth();
    const supabase = createClient();
    const [open, setOpen] = useState(false);
    const [bio, setBio] = useState(user?.bio || '');
    const [username, setUsername] = useState(user?.username || '');
    const [image, setImage] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

    useEffect(() => {
        if (user) {
          setUsername(user.username || '');
          setBio(user.bio || '');
          setAvatarUrl(user.avatar_url || '');
        }
      }, [user]);

    const updateProfile = async () => {
      if (!user?.id) return;
      let uploadedAvatarUrl = avatarUrl;
      if (image) {
        // Upload avatar to Supabase Storage
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
        const {error: uploadError } = await supabase.storage.from('avatars').upload(fileName, image, { upsert: true });
        if (uploadError) {
          toast.error('Failed to upload avatar');
          console.error(uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          uploadedAvatarUrl = publicUrlData.publicUrl;
        }
      }
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          avatar_url: uploadedAvatarUrl,
        })
        .eq('id', user.id);
      if (error) {
        toast.error('Failed to update profile');
      } else {
        toast.success('Profile updated');
        setAvatarUrl(uploadedAvatarUrl);
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
                            Profile Image
                        </Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="bg-background border border-input rounded-xl px-4 py-2 text-sm"
                            onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                setImage(e.target.files[0]);
                                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
                              }
                            }}
                        />
                        {avatarUrl && (
                            <div className="mt-2">
                                <Label className="text-sm text-muted-foreground mb-1 block">Preview</Label>
                                <Image
                                    src={avatarUrl}
                                    alt="Profile Preview"
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 rounded-full object-cover border"
                                />
                            </div>
                        )}
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
