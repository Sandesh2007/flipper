// app/protected/layout.tsx
import { createClient } from "@/lib/database/supabase/client"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase =  await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <nav className="p-4 border-b">Protected Nav - Welcome {user?.email}</nav>
      <main className="p-4">{children}</main>
    </div>
  )
}
