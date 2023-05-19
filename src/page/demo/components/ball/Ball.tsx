import React, { useEffect, useRef, useState } from 'react'
import { UseViewport } from 'utils/screen'
import './ball.css'

const Ball = () => {
  const viewPort = UseViewport()
  const isMobile = viewPort.width <= 512

  const [ball, setBall] = useState<any>()
  const [xoay, setXoay] = useState(true)
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

      // ball.style.position = 'absolute'
      ball.style.zIndex = 1000
      document.body.append(ball)

      const screenWidth = window.innerWidth - 40
      const screenHeight = window.innerHeight - 40

      function moveAt(pageX: number, pageY: number) {
        if (
          pageX - shiftX < screenWidth &&
          pageX - shiftX > -10 &&
          pageY - shiftY > 0 &&
          pageY - shiftY < screenHeight
        ) {
          ball.style.left = pageX - shiftX + 'px'
          ball.style.top = pageY - shiftY + 'px'
        } else {
          document.removeEventListener('mousemove', onMouseMove)
        }
      }

      //moveAt(event.pageX, event.pageY)

      function onMouseMove(event: any) {
        setXoay(false)
        document.body.style.overflow = 'hidden'
        // moveAt(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
        moveAt(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
      }

      ball.addEventListener('touchmove', onMouseMove)

      ball.ontouchend = function () {
        ball.removeEventListener('touchmove ', onMouseMove)
        document.body.style.overflow = 'scroll'
        // ball.ontouchend = null
      }
    }

    ball.ondragstart = function () {
      return false
    }
  }

  //màn hình máy tính
  if (ball && !isMobile) {
    ball.onmousedown = function (event: any) {
      setXoay(true)

      let shiftX = event.clientX - ball.getBoundingClientRect().left
      let shiftY = event.clientY - ball.getBoundingClientRect().top
      // ball.style.position = 'absolute'
      ball.style.zIndex = 1000
      const screenWidth = window.innerWidth - 40
      const screenHeight = window.innerHeight - 40

      document.body.append(ball)

      function moveAt(pageX: number, pageY: number) {
        if (
          pageX - shiftX < screenWidth &&
          pageX - shiftX > -10 &&
          pageY - shiftY > 0 &&
          pageY - shiftY < screenHeight
        ) {
          ball.style.left = pageX - shiftX + 'px'
          ball.style.top = pageY - shiftY + 'px'
        } else {
          document.removeEventListener('mousemove', onMouseMove)
        }
      }

      // moveAt(event.pageX, event.pageY) //cho absolute
      moveAt(event.clientX, event.clientY) //cho fixed

      function onMouseMove(event: any) {
        setXoay(false)
        // moveAt(event.pageX, event.pageY) //cho absolute
        moveAt(event.clientX, event.clientY) //cho fixed
      }

      document.addEventListener('mousemove', onMouseMove)

      ball.onmouseup = function (e: any) {
        document.removeEventListener('mousemove', onMouseMove)
        // ball.onmouseup = null
        console.log('da tha')
      }
    }

    ball.ondragstart = function () {
      return false
    }
    document.ondragstart = function () {
      return false
    }
  }
  window.ondragstart = function () {
    return false
  }

  return (
    <div>
      <i
        className={xoay ? 'dichuyen far fa-futbol' : 'far fa-futbol'}
        ref={ref}
        id='ball'
        title='Dùng để demo nhấn kéo element'
      >
        <div className={xoay ? 'nenbong' : ''}></div>
      </i>
    </div>
  )
}

export default Ball
