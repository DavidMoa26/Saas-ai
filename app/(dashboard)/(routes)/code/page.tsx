"use client"

import Heading from "@/components/heading"
import { Code } from "lucide-react"
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
import { UserAvatar } from "@/components/user-avatar"
import Typewriter from 'typewriter-effect';
import ReactMarkdown from 'react-markdown'
import { useProModal } from "@/app/hooks/use-pro-modal"

type Conversion = {
  prompt: string
  answer: string
}

const CodePage = () => {

  const router = useRouter()
  const [conversation, setConversation] = useState<Conversion[]>([])
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
      const response = await axios.post('/api/code', { messages: [{ role: "user", content: values.prompt }] })
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
        title="Code Generation"
        description="Generate code from your prompt"
        icon={Code}
        iconColor="text-yellow-500"
        bgColor="bg-yellow-500/10"
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
                      placeholder="Simple toggle button using react"
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
                <p className="px-8 flex items-center gap-x-4 rounded-lg bg-white"><UserAvatar /> {conversation.prompt}</p>
                <p className="px-6 flex items-center gap-x-4 rounded-lg bg-muted"><BotAvatar /><ReactMarkdown components={{
                  pre: ({ node, ...props }) => (
                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg"><pre {...props} /></div>
                  ),
                  code: ({ node, ...props }) => (
                    <code {...props} className="bg-black/10 rounded-lg p-1" {...props} />
                  )
                }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {conversation.answer}</ReactMarkdown></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default CodePage

