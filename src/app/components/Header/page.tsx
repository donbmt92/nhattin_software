import React from 'react'
import TopHeader from './TopHeader';
import MenuHeader from './MenuHeader';
import BottomHeader from './BottomHeader';

export default function Headers() {

    return (
        <div>
            <div style={{ backgroundColor: 'var(--clr-bg-4)', padding: "40px 0px 0px 0px" }}>
                <TopHeader />
                <MenuHeader />
            </div>
            <div style={{ backgroundColor: 'var(--clr-bg)' }}>
                <BottomHeader />
            </div>
        </div>
    )
}
