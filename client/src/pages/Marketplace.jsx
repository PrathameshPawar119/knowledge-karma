import React, { useState, useEffect } from 'react'
import Container from '@mui/material/Container';
import { getAllProducts } from '../http';
import SideBar from '../components/Product/SideBar';
import ProductCard from '../components/Product/ProductCard';
import Drawer from "../components/Drawer"



export default function Marketplace() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getAllProducts();
      console.log(response.data.data)
      setProducts(response.data.data)
    }

    fetchProducts()
  }, [])

  return (
    <div>
      {/* <h1>Marketplace</h1> */}
      <div className="w-full flex">
        {/* <SideBar /> */}
        <Drawer />

        <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-9/12 gap-2 mt-10">

          {
            products.map((product, index) => {
              return <ProductCard product={product} key={index} />
            })
          }

        </div>

      </div>
    </div>
  )
}
