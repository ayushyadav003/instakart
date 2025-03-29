// const apiUrl = 'https://instakart-backend.onrender.com/api'
const apiUrl = '/api/v1'

export const apiConfig = {
  //auth
  signup: `${apiUrl}/auth/signup`,
  login: `http://localhost:5000/api/v1/auth/login`,

  //products
  getProductList: `${apiUrl}/products/getAllProducts`,
  getProductById:`${apiUrl}/products`,
  updateProduct:`${apiUrl}/products`,
  productUrl:`${apiUrl}/products`,

  //variants
  variantUrl:`${apiUrl}/variants`
}
