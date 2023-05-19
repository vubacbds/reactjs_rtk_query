import './App.css'
import Product from 'page/product'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProductDetail from 'page/product/components/productDetail'
import ScrollToTop from 'utils/scrollToTop'
import ProductDetailList1 from 'page/product/components/productDetailList1'
import ProductDetailList2 from 'page/product/components/productDetailList2'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Demo from 'page/demo'

function App() {
  return (
    <div className='App'>
      <ScrollToTop>
        <Routes>
          <Route path='/' element={<Product />} />

          <Route path='/product/detail' element={<ProductDetail />}>
            <Route path=':productId' element={<ProductDetailList1 />} />
            <Route path='list1' element={<ProductDetailList1 />} />
            <Route index element={<ProductDetailList2 />} />
          </Route>
          <Route path='*' element={<h5>Không tìm thấy trang</h5>} />
        </Routes>
      </ScrollToTop>
      <ToastContainer />
      <Demo />
    </div>
  )
}

export default App
