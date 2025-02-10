import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ExistingUsers from "./ExistingUsers";
import PendingUsers from "./PendingUsers";
import UploadSoundDialog from "./UploadSound";
import ManageSounds from "./ManageSounds";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/control");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {/* Button that opens the Upload Sound dialog */}
      <UploadSoundDialog />
      {/* Manage Sounds Section */}
      <ManageSounds />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Existing Accounts</h2>
          <ExistingUsers />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Pending Accounts</h2>
          <PendingUsers />
        </div>
      </div>
    </div>
  );
}
