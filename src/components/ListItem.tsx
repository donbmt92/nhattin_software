import React from 'react';
import Image from 'next/image';


interface ListItemProps {
    image: string;
    title: string;
    description: string;
}

export default function ListItem({ image, title, description }: ListItemProps) {
    return (
        <div className="flex items-center space-x-4 p-4 hover:bg-gray-50">
            <div className="flex-shrink-0 w-16 h-16 relative">
                <Image
                    src={image}
                    alt={title}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover"
                />
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
}
