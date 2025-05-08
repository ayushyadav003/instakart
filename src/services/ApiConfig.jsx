

// const apiUrl = 'https://instakart-backend.onrender.com/api'
const apiUrl = "/api/v1";

export const apiConfig = {
  //auth
  signup: `${apiUrl}/auth/signup`,
  login: `${apiUrl}/auth/login`,
  profile:`${apiUrl}/auth/profile`,
  
  getUsers: `${apiUrl}/auth/getAllUsers`,
  getSingleUser : `${apiUrl}/auth/getSingleUser`,
  updateProfile: `${apiUrl}/auth/profile`,
  updateProfileAdmin: `${apiUrl}/auth/updateUserProfileAdmin`,


  //discounts
  getDiscounts: `${apiUrl}/discounts`,
  deleteDiscount: `${apiUrl}/discounts`,
  createDiscount: `${apiUrl}/discounts`,
  getDiscountById: `${apiUrl}/discounts`,
  updateDiscount: `${apiUrl}/discounts`,  


  //products
  getProductList: `${apiUrl}/products/getAllProducts`,
  searchProduct: `${apiUrl}/products/search`,
  getProductById: `${apiUrl}/products`,
  updateProduct: `${apiUrl}/products`,
  createProduct: `${apiUrl}/products`,
  deleteProduct: `${apiUrl}/products`,

  //variants
  variantUrl: `${apiUrl}/variants`,

  //orders
  orderUrl: `${apiUrl}/orders`,

  //customers
  customerUrl: `${apiUrl}/customers`,

  //transactions
  transaction : `${apiUrl}/transactions`,
};
