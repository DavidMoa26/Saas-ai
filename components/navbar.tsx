import MobileSidebar from "./mobile-sidebar"
import { getApiLimit } from "@/lib/api-limit"

interface User {
  id: string
  name: string
  email: string
  image: string
}

const Navbar = async () => {

  const apiLimit = await getApiLimit()


  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimit} />
      <div className="flex w-full justify-end">
      </div>
    </div>
  )
}
export default Navbar