'use client'

import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { thumbs } from '@dicebear/collection'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn-ui/avatar'

interface UserAvatarProps {
  uid: string
  photoURL?: string | null
  displayName?: string | null
  className?: string
}

export function UserAvatar({ uid, photoURL, displayName, className }: UserAvatarProps) {
  // Generate avatar from uid using DiceBear
  const generatedAvatar = useMemo(() => {
    const avatar = createAvatar(thumbs, {
      seed: uid,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
    })
    return avatar.toDataUri()
  }, [uid])

  // Get initials from displayName or email as fallback
  const initials = useMemo(() => {
    if (displayName) {
      return displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return '?'
  }, [displayName])

  return (
    <Avatar className={className}>
      {photoURL ? (
        <AvatarImage src={photoURL} alt={displayName || 'User avatar'} />
      ) : (
        <AvatarImage src={generatedAvatar} alt="Generated avatar" />
      )}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
