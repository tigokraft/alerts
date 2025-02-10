// app/control/page.tsx (Server Component by default)
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
// Import your new client component
import ControlClient from "./ControlClient"

export default async function ControlPage() {
  // 1. Check session on the server
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  // 2. If we reach here, user is logged in, so render the client UI
  return (
    
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Control Panel (Server)</h1>
      {/* Renders the client code with hooks, SWR, etc. */}
      <ControlClient />
    </div>
  )
}
