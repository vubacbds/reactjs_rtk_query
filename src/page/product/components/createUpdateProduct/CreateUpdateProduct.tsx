import React, { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Upload } from 'antd'
import { product } from 'types/product.type'
import { useAddProductMutation, useUpdateProductMutation } from 'page/product/product.service'
import { isEntityError } from 'utils/helpers'
import { storage } from '../../../../firebase'
import { ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import './style.css'

interface createUpdateProductType {
  closeModalCreateUpdateProduct: (state: boolean) => void
  productUpdate: null | product
}

/**
 * Mẹo copy các key của kiểu Omit<Post, 'id'> để làm key cho kiểu FormError
 */
type FormError =
  | {
      [key in keyof Omit<product, '_id'>]: string
    }
  | null

const CreateUpdateProduct = ({ closeModalCreateUpdateProduct, productUpdate }: createUpdateProductType) => {
  const [dataUpdate, setDataUpdate] = useState<any>(productUpdate)
  const handleDeleteImageUpdate = (indexImage: any) => {
    const filter = dataUpdate?.images?.filter((image: any, index: any) => {
      return index != indexImage
    })

    setDataUpdate({ ...productUpdate, images: filter })
  }

  const [form] = Form.useForm()
  useEffect(() => {
    form.resetFields()
    setFileList([])
    setDataUpdate(productUpdate)
  }, [productUpdate, closeModalCreateUpdateProduct])

  const [addProduct, addProductResult] = useAddProductMutation()
  const [updateProduct, updateProductResult] = useUpdateProductMutation()

  const handleAddProduct = async (dataProduct: any) => {
    addProduct(dataProduct)

    closeModalCreateUpdateProduct(false)

    //set lại sau khi upload ảnh thành công
    setSubmitting(false)
    setFileList([])
    setProgress(0)
  }

  const handleUpdateProduct = (valuForm: Omit<product, '_id'>) => {
    if (productUpdate) {
      updateProduct({ body: valuForm, _id: productUpdate._id })
    }

    closeModalCreateUpdateProduct(false)
    setSubmitting(false)
    setFileList([])
    setProgress(0)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  /**
   * Lỗi có thể đến từ `addPostResult` hoặc `updatePostResult`
   * Vậy chúng ta sẽ dựa vào điều kiện có postId hoặc không có (tức đang trong chế độ edit hay không) để show lỗi
   *
   * Chúng ta cũng không cần thiết phải tạo một state errorForm
   * Vì errorForm phụ thuộc vào `addPostResult`, `updatePostResult` và `postId` nên có thể dùng một biến để tính toán
   */

  const errorForm: FormError = useMemo(() => {
    const errorResult = productUpdate ? updateProductResult.error : addProductResult.error
    // Vì errorResult có thể là FetchBaseQueryError | SerializedError | undefined, mỗi kiểu lại có cấu trúc khác nhau
    // nên chúng ta cần kiểm tra để hiển thị cho đúng
    if (isEntityError(errorResult)) {
      // Có thể ép kiểu một cách an toàn chỗ này, vì chúng ta đã kiểm tra chắc chắn rồi
      // Nếu không muốn ép kiểu thì có thể khai báo cái interface `EntityError` sao cho data.error tương đồng với FormError là được
      console.log(errorResult.data.error)

      return errorResult.data.error as FormError
    }
    return null
  }, [productUpdate, updateProductResult, addProductResult])

  //Xử lý upload ảnh
  const [fileList, setFileList] = useState([])
  const [progress, setProgress] = useState(0)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [url, setUrl] = useState<any>([])

  //Loading khi submit
  const [submitting, setSubmitting] = useState(false)

  //Sửa lỗi Xem trước phóng to
  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleCancel = () => setPreviewVisible(false)

  const handleChange = (e: any) => {
    //Xử lý file quá 4 ảnh
    if (e.fileList.length > 4 && !dataUpdate) {
      alert('Chỉ được đăng 4 ảnh!')
      e.preventDefault()
      return
    }

    if (e.fileList.length + dataUpdate?.images.length > 4) {
      alert('Chỉ được đăng 4 ảnh!')
      e.preventDefault()
      return
    }

    //Xử lý lỗi trùng ảnh
    const nameImage = e.fileList[e.fileList.length - 1]?.name
    const fileListLength = e.fileList.filter((item: any) => {
      return item.name == nameImage
    }).length

    if (fileListLength == 1 || fileListLength == 0) setFileList(e.fileList)
    else {
      alert('Lỗi trùng ảnh')
    }
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(() => file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(() => file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }
  const handleUpload = (valuForm: Omit<product, '_id'>) => {
    setSubmitting(true)
    valuForm.images = []

    if (productUpdate && fileList.length == 0) {
      handleUpdateProduct({ ...valuForm, images: dataUpdate.images })
    }

    fileList.forEach((e: any) => {
      const uploadTask = storage.ref(`images/${e.originFileObj.name}`).put(e.originFileObj)
      uploadTask.on(
        'state_changed',
        (snapshot: any) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          setProgress(progress)
        },
        (error: any) => {
          console.log(error)
        },
        () => {
          storage
            .ref('images')
            .child(e.originFileObj.name)
            .getDownloadURL()
            .then((newUrl: any) => {
              // setUrl((old: any) => [...old, newUrl])
              // console.log(newUrl)
              valuForm.images.push(newUrl)

              //Chạy hàm thêm Product khi ảnh upload lên đủ
              if (fileList.length == valuForm.images.length && productUpdate) {
                handleUpdateProduct({ ...valuForm, images: [...dataUpdate.images, ...valuForm.images] })
              } else if (fileList.length == valuForm.images.length) {
                handleAddProduct(valuForm)
              }
            })
            .catch((e: any) => {
              console.log(e)
            })
        }
      )
    })
  }
  //Đóng xử lý upload ảnh

  const handleImageLeft = (array: string[], indexChoose: number, item: string) => {
    if (indexChoose !== 0) {
      const filter = array.filter((res, index) => index !== indexChoose)
      filter.splice(indexChoose - 1, 0, item)
      setDataUpdate({ ...productUpdate, images: filter })
    } else {
      const filter = array.filter((res, index) => index !== indexChoose)
      filter.splice(filter.length, 0, item)
      setDataUpdate({ ...productUpdate, images: filter })
    }
  }

  const handleImageRight = (array: string[], indexChoose: number, item: string) => {
    if (indexChoose !== array.length - 1) {
      const filter = array.filter((res, index) => index !== indexChoose)
      filter.splice(indexChoose + 1, 0, item)
      setDataUpdate({ ...productUpdate, images: filter })
    } else {
      const filter = array.filter((res, index) => index !== indexChoose)
      filter.splice(0, 0, item)
      setDataUpdate({ ...productUpdate, images: filter })
    }
  }

  return (
    <div>
      <Form
        form={form}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        style={{ maxWidth: '100%', marginTop: 40 }}
        initialValues={{
          title: productUpdate?.title,
          description: productUpdate?.description
          // image: productUpdate?.image
        }}
        // onFinish={productUpdate ? handleUpdateProduct : handleUpload}
        onFinish={handleUpload}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item label='Tiêu đề' name='title' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label='Mô tả' name='description' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input.TextArea maxLength={60} showCount />
        </Form.Item>

        <Form.Item
          label='Chọn ảnh'
          name='images'
          rules={[{ required: productUpdate && dataUpdate?.images.length > 0 ? false : true, message: 'Chưa có ảnh!' }]}
        >
          <div>
            <div className='image-old-box'>
              {dataUpdate &&
                dataUpdate?.images.map((image: any, index: any) => {
                  return (
                    <div className='div-image-old' key={index}>
                      <img className='image-old' src={image} />
                      <div className='box-icon-delete'>
                        <ArrowLeftOutlined
                          className='icon-image-left'
                          onClick={() => handleImageLeft(dataUpdate?.images, index, image)}
                        />
                        <DeleteOutlined
                          className='icon-delete-image-old'
                          onClick={() => handleDeleteImageUpdate(index)}
                        />
                        <ArrowRightOutlined
                          className='icon-image-right'
                          onClick={() => handleImageRight(dataUpdate?.images, index, image)}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
            <div>
              <Upload
                action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                listType='picture-card'
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                accept='.jpg, .png, .jpeg'
                multiple={true}
                beforeUpload={() => {
                  return false
                }}
              >
                {((dataUpdate && fileList.length + dataUpdate?.images.length < 4) ||
                  (!dataUpdate && fileList.length < 4)) && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                  </div>
                )}
              </Upload>
              {submitting && <progress value={progress} max='100' style={{ width: 96 }} />}
            </div>

            <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt='example' style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit' loading={submitting}>
            {productUpdate ? 'Sửa' : 'Thêm'}
          </Button>

          <Button type='default' style={{ marginLeft: 12 }} onClick={() => closeModalCreateUpdateProduct(false)}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateUpdateProduct
