import React from 'react'
import Headers from '../components/Header/page'
import OrderDetails from './OrderDetail.tsx/page'
import LinkContact from '../components/LinkContact/page'
import Footer from '@/components/Footer'

export default function OrderPage() {
  return (
    <div>
      <Headers/>
      <OrderDetails/>
      <LinkContact/>
      <Footer/>
    </div>
  )
}
