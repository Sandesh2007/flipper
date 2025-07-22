import React from 'react'
import FileDialog from '../file-upload'

const FileUpload = () => {
    return (
        <section className="flex flex-col justify-center gap-8 h-full" >
            <h3 className="text-neutral-950 dark:text-neutral-50 font-bold text-3xl text-center">
                Convert PDFs to flipbooks and more.
            </h3>

            <div className="self-center w-full max-w-lg">
                <FileDialog />
            </div>
        </section>
    )
}

export default FileUpload