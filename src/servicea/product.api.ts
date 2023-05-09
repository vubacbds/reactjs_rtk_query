import axiosClient from './axiosClient'

const productAPI = {
  getall: () => {
    const url = '/products'
    return axiosClient.get(url)
  }
  // addbill: (data) => {
  //   const url = `/bill/create-bill`;
  //   return axiosClient.post(url, data);
  // },
  // deletebill: (id) => {
  //   const url = `/bill/delete-bill/${id}`;
  //   return axiosClient.delete(url);
  // },
  // updatebill: (id, data) => {
  //   const url = `/bill/update-bill/${id}`;
  //   return axiosClient.put(url, data);
  // },
}

export default productAPI
