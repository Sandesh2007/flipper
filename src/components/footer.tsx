import Image from 'next/image'
import React from 'react'
import logo from "../../public/logo.svg"

const Footer = () => {
    return (
        <div className=' flex justify-center items-center w-screen border-t-2 p-8 bg-neutral-50 dark:bg-neutral-900 h-[20%] text-neutral-950 dark:text-neutral-50 ' >
            {/* Right */}
            <div
                className='flex flex-col w-[420px]'
            >
                <Image
                    src={logo}
                    alt="logo"
                    height={90}
                />
                <span>Neko Press Inc.</span>

                <p
                    className='text-[20px]'
                >
                    Create once,share everywhere.
                </p>
                <p
                    className='text-[10px] wrap-normal '
                >
                    Neko turns PDFs and other files into interactive flipbooks and engaging content for every channel.
                </p>
            </div>
        </div>
    )
}

export default Footer