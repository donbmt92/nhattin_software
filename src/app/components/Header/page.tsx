"use client"
import React from 'react'
import TopHeader from './TopHeader';
import MenuHeader from './MenuHeader';
import BottomHeader from './BottomHeader';

export default function Headers() {

    return (
        <div className="headerNhattin">
            <div style={{ backgroundColor: 'var(--clr-bg-4)' }}>
                <TopHeader />
                <MenuHeader />
            </div>
            <div style={{ backgroundColor: 'var(--clr-bg)' }}>
                <BottomHeader />
            </div>
        </div>
    )
}
