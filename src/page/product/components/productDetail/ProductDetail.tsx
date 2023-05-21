import { useGetOneProductQuery } from 'page/product/product.service'
import React, { useEffect, useState } from 'react'
import { CloseOutlined, FullscreenOutlined, HomeOutlined } from '@ant-design/icons'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import Slider from 'react-slick'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

import './style.css'
import { UseViewport } from 'utils/screen'

const ProductDetail = () => {
  const viewPort = UseViewport()
  const isMobile = viewPort.width <= 512

  const params = useParams()
  const productId = params?.productId
  const { data, isFetching, isLoading } = useGetOneProductQuery(productId)

  //Modal ảnh zoom
  const [isModalZoom, setIsModalZoom] = useState(false)

  //---setting slick
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'ease-in-out'

    // fade: true,
    // autoplay: true
  }

  const [nav1, setNav1] = useState<any>(null)
  const [nav2, setNav2] = useState<any>(null)

  return (
    <div>
      {isFetching && <h5>Loading...</h5>}
      {!isFetching && (
        <>
          <Link to='/'>
            <HomeOutlined style={{ color: '#333', marginTop: 10, fontSize: 24 }} />
          </Link>
          <h1 className='title'>{data?.title}</h1>

          <div className='detail-product'>
            <div className='detail-product-image'>
              <Slider {...settings} ref={(slider1) => setNav1(slider1)} asNavFor={nav2}>
                {data?.images?.map((image, index) => {
                  return <img height={300} alt='example' src={image} key={index} />
                })}
              </Slider>

              {!isMobile && <FullscreenOutlined className='icon-zoom' onClick={() => setIsModalZoom(true)} />}

              <div className='slider-2'>
                <Slider
                  {...settings}
                  arrows={false}
                  slidesToShow={data && data.images.length >= 4 ? 4 : 3}
                  swipeToSlide={true}
                  focusOnSelect={true}
                  ref={(slider2) => setNav2(slider2)}
                  asNavFor={nav1}
                >
                  {data?.images?.map((image, index) => {
                    return <img className='slider-image' alt='example' src={image} key={index} />
                  })}
                </Slider>
              </div>
            </div>
          </div>

          <div className={isModalZoom ? 'modal-zoom' : 'hidden-modal'}>
            <div className='modal-zoom-overlay'></div>
            <div className='modal-zoom-body'>
              <Slider {...settings} arrows={false}>
                {data?.images?.map((image, index) => {
                  return (
                    <TransformWrapper key={index}>
                      <TransformComponent>
                        <img className='img-slick' alt='example' src={image} />
                      </TransformComponent>
                    </TransformWrapper>
                  )
                })}
              </Slider>
            </div>
            <CloseOutlined className='modal-zoom-close' onClick={() => setIsModalZoom(false)} />
          </div>
        </>
      )}
      {/* <div className='router-demo'>
        <NavLink
          className={({ isActive }) => (isActive ? 'yes' : 'no')}
          to='/product/detail/list1'
          style={{ textDecoration: 'none', margin: 12 }}
        >
          List 1
        </NavLink>
        <NavLink
          end
          className={({ isActive }) => (isActive ? 'yes' : 'no')}
          to='/product/detail'
          style={{ textDecoration: 'none', margin: 12 }}
        >
          List 2
        </NavLink>
        <Outlet />
      </div> */}
    </div>
  )
}

export default ProductDetail
