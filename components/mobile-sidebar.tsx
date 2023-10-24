'use client'
import { Menu } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet"
import Sidebar from "./sidebar"
import { useState, useEffect } from "react"

interface SidebarProps {
  apiLimitCount: number
}

const MobileSidebar = ({ apiLimitCount = 0 }: SidebarProps) => {

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Sheet>
      <SheetTrigger>
        <div className="md:hidden rounded-full shadow-2xl border p-2">
          <Menu className="hover:scale-105 active:scale-95 duration-350" />
        </div>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0">
        <Sidebar apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  )
}
export default MobileSidebar