import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Col, Row } from 'antd'
import { RootState, useAppDispatch } from 'store'
import ProductItem from '../productItem'
import { cancelUpdateProduct, startUpdateProduct } from 'page/product/product.slice'
import { product } from 'types/product.type'
import SkeletonProduct from '../skeletonProduct/SkeletonProduct'
import { Button, Modal } from 'antd'
import CreateUpdateProduct from '../createUpdateProduct'
import { useAddProductMutation, useDeleteProductMutation, useGetProductQuery } from 'page/product/product.service'

const ProductList = () => {
  const { data, isLoading, isFetching } = useGetProductQuery()
  const [addProduct, addProductResult] = useAddProductMutation()
  const [deleteProduct, deleteProductResult] = useDeleteProductMutation()

  const productUpdate = useSelector((state: RootState) => state.product.productUpdate)

  const dispatch = useAppDispatch()

  const handleAddProduct = () => {
    const data: Omit<product, '_id'> = {
      title: 'Sản phẩm demo 100',
      description: 'Mô tả sản phẩm demo 100',
      images: [
        'https://cdn.tgdd.vn/Files/2014/04/03/540338/Hinh-anh-vuot-troi-cong-nghe-Clean-View-1.jpg',
        'https://sacbaongoc.net/wp-content/uploads/2022/06/300-anh-dai-dien-dep-cho-nu-che-mat-dep-ca-tinh-nhat-5-1024x1024.jpg',
        'https://kiemtientuweb.com/ckfinder/userfiles/images/avatar-dep-ngau-nu/avatar-nu-24.jpg'
      ]
    }
    addProduct(data)
  }

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId)
  }
  const handleStartUpdateProduct = (product: product) => {
    dispatch(startUpdateProduct(product))
    setIsModalCreateUpdateProduct(true)
  }

  //model
  const [isModalCreateUpdateProduct, setIsModalCreateUpdateProduct] = useState(false)
  const showModalCreateUpdateProduct = () => {
    setIsModalCreateUpdateProduct(true)

    dispatch(cancelUpdateProduct())
  }
  const closeModalCreateUpdateProduct = () => {
    setIsModalCreateUpdateProduct(false)
  }

  const handleOk = () => {
    setIsModalCreateUpdateProduct(false)
  }
  const handleCancel = () => {
    setIsModalCreateUpdateProduct(false)
  }

  return (
    <div>
      <h2 style={{ margin: '12px 0' }}>Danh sách sản phẩm</h2>
      <Button type='primary' onClick={showModalCreateUpdateProduct}>
        Thêm
      </Button>
      <Button type='default' style={{ marginLeft: 4 }} onClick={() => handleAddProduct()} title='Tạo nhanh sản phẩm'>
        Thêm nhanh
      </Button>
      <Modal
        title={productUpdate ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        open={isModalCreateUpdateProduct}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null}
        width={'100%'}
        style={{ position: 'relative', top: 16 }}
      >
        <CreateUpdateProduct
          closeModalCreateUpdateProduct={closeModalCreateUpdateProduct}
          productUpdate={productUpdate}
        />
      </Modal>

      <Row>
        {isFetching && <SkeletonProduct />}
        {!isFetching &&
          data?.map((product, index) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={index}>
              <ProductItem
                product={product}
                handleDeleteProduct={handleDeleteProduct}
                handleStartUpdateProduct={handleStartUpdateProduct}
              />
            </Col>
          ))}
      </Row>
    </div>
  )
}

export default ProductList
