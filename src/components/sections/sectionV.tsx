import React from 'react'

const SectionV = () => {
    return (
        <section className='p-4 flex justify-center'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 p-4'>
                    <h2 className='font-bold text-3xl' >Create content for every channel.</h2>
                </div>
                <div className='flex flex-col gap-4 p-7'>
                    <p className='text-wrap text-ellipsis text-justify wrap-break-word' >Neko turns PDFs and other file types into digital <a href="/nekopress" className='text-blue-500' >Flipbooks </a>
                    and shareable content types. Upload a document, watch it transform, 
                    and enhance it with interactive features like Videos and Links. Easily share the URL, Embed it onto your website, 
                    and sell content with <a href="/features/digital-sales">Digital Sales</a>. 
                    Promote your work across all channels with <a href="/features/social-posts">Social Posts</a>, 
                    <a href="/features/articles">Articles</a>, and <a href="/features/gifs">GIFs</a>.</p>
                </div>
            </div>
        </section>
    )
}

export default SectionV