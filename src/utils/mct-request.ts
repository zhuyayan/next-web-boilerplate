import axios from 'axios';

const MCTAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
})

MCTAxiosInstance.interceptors.request.use((config)=>{
  config.headers['Authorization'] = 'Bearer ' + "1234567890"
  return config
}, (error) => {
  return Promise.reject(error)
})

MCTAxiosInstance.interceptors.response.use((response) => {
  const { code } = response.data
  console.log(response.headers['content-type'])
  if (code === 0) {
    console.log('操作成功')
  } else {
    console.log('操作失败')
  }
  return response
},(error) => {
  return Promise.reject(error)
})

export default MCTAxiosInstance