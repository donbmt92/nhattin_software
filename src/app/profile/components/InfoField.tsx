"use client";
import React, { memo } from 'react';

interface InfoFieldProps {
    label: string;
    value: string;
}

const InfoField = memo(({ label, value }: InfoFieldProps) => {
    const displayName = 'InfoField';
    InfoField.displayName = displayName;
    
    return (
        <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-sm">{value}</p>
        </div>
    );
});

export default InfoField; 