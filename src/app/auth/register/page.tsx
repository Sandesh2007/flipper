'use client'

// Some parts are commented out because they can be readded later if my mind changed ^_^
import AuthForm from '@/components/authform'
// import Image from 'next/image'
// import logo from "../../../public/logo.svg";
// import Link from 'next/link'
import React, { Suspense } from 'react'
// import { ThemeToggle } from '@/components/themeToggle'

export default function Login() {
  return (
    <>
      {/* <header className='sticky top-0 z-50 border-b-[1px] border-neutral-700' > */}
      {/* <nav className="flex justify-between items-center p-2 w-full"> */}
      {/* Left Side: Logo */}
      {/* <div className="flex items-center gap-4 w-full lg:w-auto"> */}
      {/* <Link href="/" className="flex gap-2 items-center"> */}
      {/* <Image src={logo} alt="logo" height={40} priority /> */}
      {/* <span className="font-semibold text-lg">Neko Press</span> */}
      {/* </Link> */}
      {/* </div> */}
      {/* Right Side: Theme Button */}
      {/* <div className="flex items-center gap-2"> */}
      {/* <ThemeToggle /> */}
      {/* </div> */}
      {/* </nav> */}
      {/* </header> */}
      <main className="flex h-screen items-center justify-center bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthForm />
        </Suspense>
      </main>
    </>
  )
}
