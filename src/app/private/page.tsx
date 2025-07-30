import { redirect } from 'next/navigation'

import { createClient } from '@/lib/database/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/register')
  }

  return <p>Hello {data.user.email}</p>
}