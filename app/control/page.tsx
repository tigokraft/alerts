import {AppSidebar} from "@/components/app-sidebar";

export default function ControlPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the Control Panel</p>
      </div>
    </div>
  );
}
