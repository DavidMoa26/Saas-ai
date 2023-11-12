'use client'

import Link from "next/link"
import Image from 'next/legacy/image'
import { Code, Music, LayoutDashboard, MessageSquare, ImageIcon, VideoIcon, LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import FreeCounter from "./free-counter"
import { useProModal } from "@/app/hooks/use-pro-modal"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"


const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: 'text-sky-500'

  },
  {
    label: "Conversion",
    icon: MessageSquare,
    href: "/conversion",
    color: 'text-violet-500'

  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: 'text-pink-500'

  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: 'text-orange-700'

  },
  {
    label: "Music Generation",
    icon: Music,
    href: "/music",
    color: 'text-emerald-500'

  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
    color: 'text-yellow-500'

  }
]

interface SidebarProps {
  apiLimitCount?: number
}

const Sidebar = ({ apiLimitCount = 0 }: SidebarProps) => {

  const pathname = usePathname()
  const proModal = useProModal()


  return (
    <div className={`${proModal.isOpen && 'hidden'}`}>
      <div className="min-h-screen space-y-4 py-4 flex flex-col bg-[#111827] text-white ">
        <div className="px-3 py-2 flex-1">
          <Link href="/dashboard" className="flex items-center pl-3 mb-5">
            <div className="relative w-12 h-12 mr-4">
              <Image src="/logo.png" alt="logo" layout="fill" className="rounded-full hover:scale-105 active:scale-95 duration-350" />
            </div>
            <h1 className="text-xl font-bold">Ai-Saas Platform</h1>
          </Link>
          <div className="mb-8 flex items-center justify-center">
            <Button onClick={() => signOut({ callbackUrl: '/' })} variant="destructive" className="flex justify-center items-center rounded-full">
              <div className="flex items-center flex-1 text-[10px]">
                <LogOut className={"h-4 w-4 mr-1 my-1 rotate-180"} />
                {"LOGOUT"}
              </div>
            </Button>
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}
                className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  pathname === route.href ? "bg-white/10 text-white" : "text-zinc-400"
                )}>
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <FreeCounter apiLimitCount={apiLimitCount} />
      </div>
    </div>
  )
}
export default Sidebar