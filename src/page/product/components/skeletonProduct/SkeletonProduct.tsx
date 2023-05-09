import { Col, Row } from 'antd'
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonProduct = () => {
  return (
    <>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Skeleton style={{ width: '240px', height: '300px', margin: '20px 0px' }} />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Skeleton style={{ width: '240px', height: '300px', margin: '20px 0px' }} />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Skeleton style={{ width: '240px', height: '300px', margin: '20px 0px' }} />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Skeleton style={{ width: '240px', height: '300px', margin: '20px 0px' }} />
      </Col>
    </>
  )
}

export default SkeletonProduct
