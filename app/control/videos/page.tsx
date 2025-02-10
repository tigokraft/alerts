// app/control/videos/page.tsx

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import VideosClient from "./VideosClient"

export default async function VideosPage() {
  // Server-side session check
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  // If user is logged in, render the client UI
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Videos</h2>
      {/* Child client component */}
      <VideosClient />
    </div>
  )
}
