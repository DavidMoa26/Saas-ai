import { useEffect, useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import { Zap } from "lucide-react"
import { useProModal } from "@/app/hooks/use-pro-modal"

interface SidebarProps {
  apiLimitCount: number
}

const FreeCounter = ({ apiLimitCount }: SidebarProps) => {
  const [mounted, setMounted] = useState(false)
  const proModal = useProModal()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null


  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <div>{apiLimitCount} / 5 Free Generations</div>
            <Progress className="h-3" value={(apiLimitCount / 5) * 100} />
            <Button onClick={proModal.onOpen} variant={'premium'}>
              Upgrade
              <Zap className="w-4 h-4 ml-2 fill-white" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default FreeCounter