"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button";

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from "next/navigation";

const font = Montserrat({ weight: '600', subsets: ['latin'] });


export const LandingNavbar = () => {


  const { status } = useSession()
  const router = useRouter()


  const getStartedHandler = () => {

    if (status === 'authenticated') {
      router.push('/dashboard')
    } else {
      signIn('google', { callbackUrl: '/dashboard' })
    }
  }

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-4">
          <Image fill alt="Logo" src="/logo.png" />
        </div>
      </Link>
      <div className="flex items-center gap-x-2">
        <Button onClick={getStartedHandler} variant="outline" className="rounded-full">
          Get Started
        </Button>
      </div>
    </nav>
  )
}