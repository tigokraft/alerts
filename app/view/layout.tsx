export default function ViewLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <title>
          view
        </title>
        <div className="w-full h-screen bg-black">
          {children}
        </div>
      </>
    );
}
  