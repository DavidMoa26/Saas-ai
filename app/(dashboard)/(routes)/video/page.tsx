"use client"

import Heading from "@/components/heading"
import { Video } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { formSchema } from "./constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useRouter } from 'next/navigation'
import { Empty } from "@/components/empty"
import { Loader } from "@/components/loader"
import { useProModal } from "@/app/hooks/use-pro-modal"


const VideoPage = () => {

  const router = useRouter()
  const [video, setVideo] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const proModal = useProModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  })


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      setVideo(undefined);
      const response = await axios.post('/api/video', values)
      setVideo(response.data[0]);

    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen()
      }
    } finally {
      setIsLoading(false)
      form.reset();
      router.refresh();
    }
  }



  return (
    <div>
      <Heading
        title="Video Generation"
        description="Convert text to video"
        icon={Video}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField name="prompt" render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="ex : Clown fish swimming around reef"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )} />
              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col-reverse gap-y-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader />
              </div>
            )}
            {!video && !isLoading && <Empty label="No conversation started" />}
            {video && (
              <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
                <source src={video} />
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default VideoPage