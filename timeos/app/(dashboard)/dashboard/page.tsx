// Dashboard page
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Welcome to TimeOS Dashboard</h1>
      <p className="text-muted-foreground mt-2">You're logged in as: {user.email}</p>
    </div>
  )
}