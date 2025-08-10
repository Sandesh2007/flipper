import { createClient } from '@/lib/database/supabase/client'
import { useEffect, useState } from 'react'

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null)
  const [retryCount] = useState(0)

  useEffect(() => {
    const fetchUserImage = async () => {
      const supabase = createClient()
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error('Session error:', sessionError)
        setImage(null)
        return
      }

      const user = sessionData.session?.user
      if (!user) {
        setImage(null)
        return
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single()

        if (!profileError && profileData?.avatar_url) {
          const uploadedImageUrl = profileData.avatar_url
          
          const img = new Image()
          img.onload = () => {
            console.log('Using user-uploaded avatar from Supabase storage')
            setImage(uploadedImageUrl)
          }
          img.onerror = () => {
            console.warn('User-uploaded avatar failed to load, trying Google avatar')
            tryGoogleAvatar(user)
          }
          img.src = uploadedImageUrl
          return
        }

        tryGoogleAvatar(user)

      } catch (error) {
        console.error('Error fetching user profile:', error)
        tryGoogleAvatar(user)
      }
    }

    const tryGoogleAvatar = (user: { user_metadata?: { avatar_url?: string } }) => {
      const googleAvatarUrl = user.user_metadata?.avatar_url
      
      if (googleAvatarUrl) {
        const img = new Image()
        img.onload = () => {
          console.log('Using Google profile avatar')
          setImage(googleAvatarUrl)
        }
        img.onerror = () => {
          console.warn('Google profile image failed to load, using local fallback')
          setImage(null)
        }
        img.src = googleAvatarUrl
      } else {
        console.log('No Google avatar available, using local fallback')
        setImage(null)
      }
    }

    fetchUserImage()
  }, [retryCount])

  return image
}
