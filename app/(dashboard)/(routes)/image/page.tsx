// 2:38

"use client"

import Heading from "@/components/heading"
import { Download, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { amountOptions, formSchema, resolutionOptions } from "./constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent, SelectLabel } from "@/components/ui/select"
import axios from "axios"
import { useRouter } from 'next/navigation'
import { Empty } from "@/components/empty"
import { Loader } from "@/components/loader"
import { Card, CardFooter } from "@/components/ui/card"
import { useProModal } from "@/app/hooks/use-pro-modal"

const ImagePage = () => {

  const [images, setImages] = useState<string[]>([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const proModal = useProModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    }
  })


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([])
      setIsLoading(true)
      const response = await axios.post('/api/image', values)
      const urls = response.data.map((image: { url: string }) => image.url)
      setImages(urls);
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
        title="Image Generation"
        description="Convert Your Minds To Image"
        icon={ImageIcon}
        iconColor="text-pink-500"
        bgColor="bg-pink-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2"
            >
              <FormField name="prompt" render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormControl className="m-0 p-0">
                    <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Enter your minds here"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
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
            {images.length === 0 && !isLoading && <Empty label="No images generated" />}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {images.length > 0 && images.map((src: string, index: number) => (
            <Card key={index} className="rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={src}
                  alt="Generated"
                  layout="fill"
                  loading="eager"
                />
              </div>
              <CardFooter className="p-2">
                <Button onClick={() => window.open(src)} variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
export default ImagePage