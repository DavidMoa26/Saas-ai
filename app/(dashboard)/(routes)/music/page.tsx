"use client"

import Heading from "@/components/heading"
import { Music } from "lucide-react"
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
import Image from "next/image"
import { useProModal } from "@/app/hooks/use-pro-modal"


type Music = {
  audio?: string
  image?: string
}

const MusicPage = () => {

  const router = useRouter()
  const [music, setMusic] = useState<Music>({
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    image: "https://i.ibb.co/k4MDwcY/pexels-krivec-ales-547115.jpg"
  })
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
      setMusic(prev => ({
        ...prev,
        audio: undefined
      }));
      const response = await axios.post('/api/music', values)
      setMusic(prev => ({
        ...prev,
        audio: response.data.audio
      }));

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
        title="Music Generation"
        description="Convert text to music"
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                      placeholder="ex : piano solo"
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
            {!music && !isLoading && <Empty label="No conversation started" />}
            {music && music.audio && music.image && (
              <div className="relative h-[400px]">
                <Image src={music.image} alt="image" fill className="rounded-t-3xl" />
                <audio controls className="mt-8 w-full h-full ">
                  <source src={music.audio} className="bg- " />
                </audio>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default MusicPage