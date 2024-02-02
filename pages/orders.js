import Layout from '@/components/Layout'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function order() {
  const [orders,setOrders]=useState([]);
  useEffect(()=>{
  axios.get('/api/orders').then(response=>{
    setOrders(response.data);
  })
  },[])
  return (
   <Layout>
    <h1>Orders</h1>
    <table className='basic'>
      <thead>
        <tr>
          <th>Date</th>
          <th>Recipient</th>
          <th>Products</th>
          <th>Total Price (with delivery charges)</th>
        </tr>
      </thead>
      <tbody>
      {orders.length>0 && orders.map((order,index)=>(
        <tr key={index}>
          <td>{(new Date(order.createdAt)).toLocaleString()}
            </td>
          <td>
            Name: {order.name}<br/>
            Phone no: {order.number}<br/>
            City: {order.city}<br/>
            PostalCode: {order.postalCode}<br/>
            Country: {order.country}<br/>
            Address: {order.streetAddress}
          </td> 
          <td>
            {order.line_items.map((l,index) => (
              <React.Fragment key={index}>
              {l.price_data?.product_data.name} x 
               {l.quantity} = {l.price_data?.unit_amount} <br/>
                
                </React.Fragment>
            ))}
          </td>
          <td>
           Rs.{order.total}
          </td>
        </tr>

      )

      )}
      </tbody>
    </table>
   </Layout>
  )
}

export default order
