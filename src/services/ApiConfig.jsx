// const apiUrl = 'https://instakart-backend.onrender.com/api'
const apiUrl = "/api/v1";

export const apiConfig = {
  //auth
  signup: `${apiUrl}/auth/signup`,
  login: `${apiUrl}/auth/login`,
  profile:`${apiUrl}/auth/profile`,

  //products
  getProductList: `${apiUrl}/products/getAllProducts`,
  getProductById: `${apiUrl}/products`,
  updateProduct: `${apiUrl}/products`,
  productUrl: `${apiUrl}/products`,

  //variants
  variantUrl: `${apiUrl}/variants`,

  //orders
  orderUrl: `${apiUrl}/orders`,

  //customers
  customerUrl: `${apiUrl}/customers`,
};
