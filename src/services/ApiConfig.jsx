// const apiUrl = 'https://instakart-backend.onrender.com/api'
const apiUrl = 'http://localhost:5000'

export const apiConfig = {
  //auth
  signup: `${apiUrl}/v1/auth/signup`,
  login: `${apiUrl}/v1/auth/login`,

  //products
  getProductList: `${apiUrl}/v1/auth/products`,
}
