import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { getApiLimitCount } from "@/lib/api-limit"
import { useProModal } from "../hooks/use-pro-modal"
import { use } from "react"

const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {

  const apiLimitCount = await getApiLimitCount()

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:w-72 md:flex md:flex-col md:fixed md:inset-y-0 z-[80]">
        <div className={'text-white'}>
          <Sidebar apiLimitCount={apiLimitCount} />
        </div>
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
  )
}
export default DashboardLayout