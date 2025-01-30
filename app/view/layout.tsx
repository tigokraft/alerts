export default function ViewLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="w-full h-screen bg-black">
        {children}
      </div>
    );
}
  