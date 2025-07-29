'use client'

import { useCurrentUserImage } from '@/hooks/use-current-user-image'
import { useCurrentUserName } from '@/hooks/use-current-user-name'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'

export const CurrentUserAvatar = () => {
  const profileImage = useCurrentUserImage()
  const name = useCurrentUserName()
  const [_imageError, setImageError] = useState(false)
  const initials = name
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase()

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage 
        src={profileImage}
        alt={initials} 
        onError={handleImageError}
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
