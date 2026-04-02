import type { Metadata } from "next";
import { Syne, JetBrains_Mono, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FinTrack — Finance Dashboard",
  description: "Track your income, expenses, and financial insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${jetbrainsMono.variable} ${dmSans.variable} dark`}
    >
      <head>
        {/* Restore saved theme before first paint — no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fintrack-theme');if(t==='light')document.documentElement.classList.remove('dark');else document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            },
          }}
        />
      </body>
    </html>
  );
}
