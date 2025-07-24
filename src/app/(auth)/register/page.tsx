import AuthForm from '@/components/authform'
// import Image from 'next/image'
// import logo from "../../../public/logo.svg";
// import Link from 'next/link'
import React from 'react'
// import { ThemeToggle } from '@/components/themeToggle'

const Login = () => {
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
        <AuthForm />
      </main>
    </>
  )
}

export default Login