export default function ControlLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-900 text-white h-screen p-4">
        <h2 className="text-xl font-bold mb-6">Control Panel</h2>
        <nav>
          <ul>
            <li className="mb-2"><a href="/control/overview">Overview</a></li>
            <li className="mb-2"><a href="/control/alerts">Alerts</a></li>
            <li className="mb-2"><a href="/control/videos">Videos</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
