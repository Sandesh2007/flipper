import React from 'react'
import Card from '../card'

function ConversionInfo() {
    return (
        <section className="p-4 flex justify-center" >
            <div
                className="flex flex-col justify-center gap-8 h-full p-4 w-full "
            >
                <h2 className="text-neutral-950 w-full dark:text-neutral-50 font-bold sm:text-3xl ">
                    Turn your files into a...
                </h2>

                <div className="flex flex-wrap gap-4 justify-evenly">
                    <Card
                        name="Flipbook"
                        image="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbookStatic.jpg"
                        hover_preview="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbook.gif"
                    />
                    <Card
                        name="Social Post"
                        image="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbookStatic.jpg"
                        hover_preview="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbook.gif"
                    />
                    <Card
                        name="Article"
                        image="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbookStatic.jpg"
                        hover_preview="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbook.gif"
                    />
                    <Card
                        name="GIF"
                        image="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbookStatic.jpg"
                        hover_preview="https://issuu.com/publisher-space/assets/illustrations/preview/gifFlipbook.gif"
                    />
                </div>
            </div>
        </section>
    )
}

export default ConversionInfo