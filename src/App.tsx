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
import { useEffect, useRef, useState } from 'react'
import { UseViewport } from 'utils/screen'

function App() {
  const viewPort = UseViewport()
  const isMobile = viewPort.width <= 512

  const [ball, setBall] = useState<any>()
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      setBall(ref.current)
    }
  }, [ref])

  if (ball && isMobile) {
    ball.ontouchstart = (event: any) => {
      setXoay(true)
      let shiftX = event.changedTouches[0].clientX - ball.getBoundingClientRect().left
      let shiftY = event.changedTouches[0].clientY - ball.getBoundingClientRect().top

      ball.style.position = 'absolute'
      ball.style.zIndex = 1000
      document.body.append(ball)

      const screenWidth = window.innerWidth - 38
      const screenHeight = window.innerHeight - 38

      function moveAt(pageX: number, pageY: number) {
        if (pageX - shiftX < screenWidth && pageX - shiftX > -10 && pageY - shiftY > 0) {
          ball.style.left = pageX - shiftX + 'px'
          ball.style.top = pageY - shiftY + 'px'
        } else {
          return
        }
      }

      moveAt(event.pageX, event.pageY)

      function onMouseMove(event: any) {
        setXoay(false)
        document.body.style.overflow = 'hidden'
        moveAt(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
      }

      ball.addEventListener('touchmove', onMouseMove)

      ball.ontouchend = function () {
        ball.removeEventListener('touchmove ', onMouseMove)
        // ball.ontouchend = null
        document.body.style.overflow = 'scroll'
      }
    }

    ball.ondragstart = function () {
      return false
    }
  }

  if (ball && !isMobile) {
    ball.onmousedown = function (event: any) {
      setXoay(true)

      let shiftX = event.clientX - ball.getBoundingClientRect().left
      let shiftY = event.clientY - ball.getBoundingClientRect().top
      ball.style.position = 'absolute'
      ball.style.zIndex = 1000
      const screenWidth = window.innerWidth - 38
      const screenHeight = window.innerHeight - 38

      document.body.append(ball)

      function moveAt(pageX: number, pageY: number) {
        if (pageX - shiftX < screenWidth && pageX - shiftX > -10 && pageY - shiftY > 0) {
          ball.style.left = pageX - shiftX + 'px'
          ball.style.top = pageY - shiftY + 'px'
        } else {
          return
        }
      }

      moveAt(event.pageX, event.pageY)

      function onMouseMove(event: any) {
        setXoay(false)
        moveAt(event.pageX, event.pageY)
      }

      document.addEventListener('mousemove', onMouseMove)

      ball.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove)
        ball.onmouseup = null
      }
    }

    ball.ondragstart = function () {
      return false
    }
  }

  const [xoay, setXoay] = useState(false)

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
      <i className={xoay ? 'far fa-futbol dichuyen' : 'far fa-futbol'} ref={ref} id='ball'></i>
    </div>
  )
}

export default App
