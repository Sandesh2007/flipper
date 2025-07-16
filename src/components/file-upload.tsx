'use client'

import { CloudUpload, FileText, Trash2 } from 'lucide-react'
import React, { useRef, useState } from 'react'

const FileDialog = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = event.target.files?.[0]
        if (newFile) {
            setFiles(prev => [...prev, newFile])
        }
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)

        const newFile = event.dataTransfer.files?.[0]
        if (newFile) {
            setFiles(prev => [...prev, newFile])
        }
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const openFilePicker = () => {
        fileInputRef.current?.click()
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col gap-2">
            <div
                className={`
                    flex flex-col items-center justify-center gap-2
                    p-4 w-full h-48 border-2 border-dashed rounded-md
                    text-neutral-700 dark:text-neutral-50
                    transition-colors
                    ${isDragging ? ' bg-neutral-700 ' : 'bg-transparent'}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <CloudUpload size={50} className="mb-2" />
                {/* <p className="text-sm">
                    {isDragging ? 'Drop the file here' : 'Drag & drop file to upload'}
                </p> */}

                <button
                    onClick={openFilePicker}
                    className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 cursor-pointer transition-colors w-full
                    sm:w-auto sm:px-6 sm:py-2 sm:rounded-md
                    "
                >
                    Select File
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {files.length > 0 && (
                <div className="w-full border rounded-md p-2 bg-neutral-50 dark:bg-neutral-800">
                    <h3 className="text-sm font-semibold mb-2">Uploaded Files</h3>
                    <ul className="space-y-1">
                        {files.map((file, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center text-sm p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText size={16} />
                                    <span className="truncate max-w-xs">{file.name}</span>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                    aria-label="Remove file"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default FileDialog
