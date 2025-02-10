import { ThemeProvider } from "next-themes";
import { Providers } from "./providers"
import "@/app/globals.css";

export const metadata = {
  title: "My App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        {/* next-themes handles applying "dark" / "light" classes to <body> or <html> */}
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system">
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
