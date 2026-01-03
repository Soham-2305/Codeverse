// import type React from "react"
// import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
// import "./globals.css"
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"
// import { Toaster } from "@/components/ui/toaster"

// const geist = Geist({ subsets: ["latin"] })
// const geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "FraudGuard - AI Fraud Detection System",
//   description: "Real-time transaction monitoring and risk analysis",
//   generator: "v0.app",
//   icons: {
//     icon: [
//       {
//         url: "/icon-light-32x32.png",
//         media: "(prefers-color-scheme: light)",
//       },
//       {
//         url: "/icon-dark-32x32.png",
//         media: "(prefers-color-scheme: dark)",
//       },
//       {
//         url: "/icon.svg",
//         type: "image/svg+xml",
//       },
//     ],
//     apple: "/apple-icon.png",
//   },
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geist.className} ${geistMono.className} antialiased`}>
//         <SidebarProvider>
//           <div className="flex min-h-screen w-full">
//             <AppSidebar />
//             <main className="flex-1 overflow-auto bg-background">
//               <div className="p-4 md:hidden">
//                 <SidebarTrigger />
//               </div>
//               {children}
//             </main>
//           </div>
//         </SidebarProvider>
//         <Toaster />
//         <Analytics />
//       </body>
//     </html>
//   )
// }


//layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FraudGuard - AI Fraud Detection System",
  description: "Real-time transaction monitoring and risk analysis",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${geistMono.className} antialiased`}>
        {/* The SidebarProvider is gone from here! */}
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}