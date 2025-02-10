import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import AlertsClient from "./AlertsClient"

export default async function AlertsPage() {
  // Server-side session check
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  // If logged in, render the client component with alerts logic
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Alerts</h2>
      <AlertsClient />
    </div>
  )
}
