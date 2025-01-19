import Image from 'next/image'
import React from 'react'

export default function LinkContact() {
  return (
    <div style={{backgroundColor: 'var(--clr-bg-0)'}}>
      <div className="container mx-auto my-4">
        <div className="flex justify-end items-center">
            <Image src="/images/icon/icon11.png" alt="Facebooks" className="mx-2 cursor-pointer w-10"  width={1000} height={100} />
            <Image src="/images/icon/icon12.png" alt="TikTok" className="mx-2 cursor-pointer w-10" width={1000} height={100} />
            <Image src="/images/icon/icon13.png" alt="Instagram" className="mx-2 cursor-pointer w-10" width={1000} height={100} />
            <Image src="/images/icon/icon14.png" alt="Youtube" className="mx-2 cursor-pointer w-10" width={1000} height={100} />
        </div>
      </div>
    </div>
  )
}
