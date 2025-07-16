import Image from 'next/image';
import React from 'react';

type CardProps = {
    name: string;
    image: string;
    hover_preview?: string;
};

const Card: React.FC<CardProps> = ({ name, image, hover_preview }) => {
    return (
        <div className="group flex flex-col items-center rounded-2xl bg-transparent sm:w-64">
            {/* Image */}
            <div className="relative w-full rounded-xl overflow-hidden">
                {/* Base Image */}
                <Image
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover rounded-xl"
                />

                {/* Hover Preview Overlay */}
                {hover_preview && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                        <Image
                            src={hover_preview}
                            alt={`${name} preview`}
                            className="h-fit rounded-lg shadow-lg"
                        />
                    </div>
                )}
            </div>

            {/* Title */}
            <a
                href="#"
                className="mt-3 text-base font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
                {name}
            </a>
        </div>
    );
};

export default Card;
