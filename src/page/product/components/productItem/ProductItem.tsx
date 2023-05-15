import React, { useState } from 'react'
import { Button, Card, Popconfirm } from 'antd'
import { product } from 'types/product.type'
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, RightCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import Slider from 'react-slick'
const { Meta } = Card

interface productItemType {
  product: product
  handleDeleteProduct: (productId: string) => void
  handleStartUpdateProduct: (product: product) => void
}
const ProductItem = ({ product, handleDeleteProduct, handleStartUpdateProduct }: productItemType) => {
  const handleDetailProduct = (productId: string) => {}
  const navigate = useNavigate()

  //---setting slick
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'ease-in-out'

    // fade: true,
    // autoplay: true
  }
  const [sliderIndex, setSliderIndex] = useState<any>()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ margin: 'auto', width: '80%' }}>
        <Card
          actions={[
            <InfoCircleOutlined
              key='info'
              title='Xem chi tiết'
              onClick={() => navigate(`/product/detail/${product._id}`)}
              // onClick={() => setIsModalZoom(true)}
            />,
            <EditOutlined key='edit' onClick={() => handleStartUpdateProduct(product)} title='Sửa sản phẩm' />,
            <Popconfirm
              placement='top'
              title={`Xóa sản phẩm này ?`}
              onConfirm={() => handleDeleteProduct(product._id)}
              cancelText='Hủy'
              okText='Xóa'
            >
              <DeleteOutlined key='delete' title='Xóa sản phẩm' />
            </Popconfirm>,
            <RightCircleOutlined key='next ' onClick={() => sliderIndex.slickNext()} title='Chuyển ảnh' />
          ]}
          hoverable
          style={{ width: '100%', height: 300, margin: '20px 0px' }}
          cover={
            <Slider {...settings} ref={(res: any) => setSliderIndex(res)}>
              {product?.images?.map((image, index) => {
                return <img alt='example' src={image} height={160} key={index} />
              })}
            </Slider>
          }
          onClick={() => handleDetailProduct(product._id)}
        >
          <Meta title={product.title} description={product.description} />
        </Card>
        {/* <Button onClick={() => sliderIndex.slickNext()}>Đi tới ảnh thứ 3</Button> */}
      </div>
    </div>
  )
}

export default ProductItem
