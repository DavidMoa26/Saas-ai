"use client"

import Heading from "@/components/heading"
import { MessageSquare } from "lucide-react"
import { set, useForm } from "react-hook-form"
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
import { BotAvatar } from "@/components/bot-avatar"
import Typewriter from 'typewriter-effect';
import { useProModal } from "@/app/hooks/use-pro-modal"
import { useSession } from "next-auth/react"
import { UserAvatar } from "@/components/user-avatar"

type Conversion = {
  prompt: string
  answer: string
}

const ConversionPage = () => {

  const router = useRouter()
  const [conversation, setConversation] = useState<Conversion[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { data } = useSession();


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
      const response = await axios.post('/api/conversion', { messages: [{ role: "user", content: values.prompt }] })
      const currentConversation = { prompt: values.prompt, answer: response.data }
      setConversation((current) => [...current, currentConversation]);
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
        title="Conversion"
        description="Convert text to speech"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                      placeholder="Enter your prompt"
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
            {conversation.length === 0 && !isLoading && <Empty label="No conversation started" />}
            {conversation.map((conversation: Conversion, index) => (
              <div key={index} className="py-8 w-full flex flex-col gap-y-8 border border-black/10 rounded-lg">
                <div className="px-8 flex items-center gap-x-4 rounded-lg bg-white"><UserAvatar /> {conversation.prompt}</div>
                <div className="px-6 flex items-center gap-x-4 rounded-lg bg-muted"><BotAvatar /> <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString([conversation.answer].join(""))
                      .start();
                  }}
                  options={{
                    delay: 20,
                  }}
                /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ConversionPage