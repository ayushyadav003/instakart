const apiUrl = 'https://api.blitzshipz.com'
const apiUrl2 = 'https://backend.blitzshipz.com'
// const apiUrl2 = 'https://staging-api.blitzshipz.com'
// const stagingApiUrl = 'https://staging-api.blitzshipz.com'
// const apiUrl = 'http://44.201.170.240'
// const apiUrl = 'http://localhost:8080'

export const apiConfig = {
  //auth
  signup: `${apiUrl}/api/auth/signup`,
  signin: `${apiUrl}/api/auth/signin/email`,
  verifyEmail: `${apiUrl}/api/auth/verifyUser`,
  // verifyEmail: `${apiUrl}/api/auth/verify-email-send`,
  // refreshToken: `${apiUrl}/-`,

  //dashboard
  dashboard: `${apiUrl}/dashboard/overview-order`,
  dashboardGraph: `${apiUrl}/dashboard/order-data-graph`,
  orderDataRevenue: `${apiUrl}/dashboard/order-data-revenue`,
  pickupOrders: `${apiUrl}/dashboard/pickedUp-details`,

  //user
  getUser: `${apiUrl}/auth/user/details`,
  editUser: `${apiUrl}/auth/user/edit-user-details`,
  updatePassword: `${apiUrl}/auth/user/password-update`,

  //banking
  getBankingInfo: `${apiUrl}/auth/user/get-banking-details`,
  addBankingInfo: `${apiUrl}/auth/user/add-banking-details`,
  editBankingInfo: `${apiUrl}/auth/user/edit-banking-details`,

  //warehouse
  getWarehouse: `${apiUrl}/auth/warehouse/view-warehouses`,
  createWarehouse: `${apiUrl}/auth/warehouse/create`,
  editWarehouse: `${apiUrl}/auth/warehouse/edit`,
  deleteWarehouses: `${apiUrl}/auth/warehouse/delete-warehouses`,

  //seller
  getSellers: `${apiUrl}/api/sellers/get`,
  createSeller: `${apiUrl}/api/sellers/create`,
  updateSeller: `${apiUrl}/api/sellers`,

  //category
  getAllCategories: `${apiUrl}/auth/product/get-all-category`,

  //product
  getProducts: `${apiUrl}/auth/product/get-all-products`,
  addProduct: `${apiUrl}/auth/product/add-product`,
  editProduct: `${apiUrl}/auth/product/edit-product`,
  deleteProduct: `${apiUrl}/auth/product/delete-product`,

  //order
  createOrder: `${apiUrl}/auth/order/create-order`,
  editOrder: `${apiUrl}/auth/order/edit-order`,
  getOrders: `${apiUrl}/auth/order/get-my-orders`,
  filterOrders: `${apiUrl}/auth/order/filter`,
  getOrdersPage: `${apiUrl}/auth/order/get-my-orders-page?`,
  menifestOrder: `${apiUrl}/auth/order/get-order-manifest`,
  makeOrderLive: `${apiUrl}/auth/order/make-order-delivery`,
  orderLive: `${apiUrl}/auth/order/make-order-live`,
  shipmentLabel: `${apiUrl}/auth/order/shipment-label`,
  getMenifestRates: `${apiUrl}/auth/order/get-rates`,

  trackOrder: `${apiUrl}/auth/order/track-order`,

  cancelOrder: `${apiUrl}/auth/order/cancel-live-order`,
  deleteManifestOrder: `${apiUrl}/auth/order/delete-order-manifest`,

  //rate
  rateCalculator: `${apiUrl}/auth/order/rate-calculator`,
  rateCard: `${apiUrl}/auth/zone/get-rate-card`,

  //ndr
  getNdrList: `${apiUrl}/auth/ndr/get-order-user-page`,
  ndrAction: `${apiUrl}/auth/ndr/take-action`,
  returnShipment: `${apiUrl}/auth/ndr/return-shipment`,
  ndrOverview: `${apiUrl}/auth/order/v2/ndr-orders-overview`,
  ndrOrdersList: `${apiUrl}/auth/order/v2/ndr-orders-list`,

  //forget password
  forgetPassword: `${apiUrl}/api/auth/resetPassword`,
  resetPassword: `${apiUrl}/api/auth/validateToken`,

  //cod
  getOrderRemittance: `${apiUrl}/auth/cod/get-order-remittance`,
  getAllCodPayment: `${apiUrl}/auth/cod/getAll-cod-payment`,
  getCodList: `${apiUrl}/auth/cod/get-cod-payment-user`,
  getCodSummary: `${apiUrl}/auth/cod/get-cod-summary`,
  getRemittanceDate: `${apiUrl}/cod/order/get-order-remittance`,

  //rto
  getAllRto: `${apiUrl}/auth/order/get-rto-orders`,

  //cancel
  cancelledOrders: `${apiUrl}/auth/order/get-cancel-orders`,

  //postal
  // postOffice: `${apiUrl}/postal/postOfficeByIdv2`,
  postOffice: `${apiUrl}/postal/postOfficeById`,

  //documents
  uploadDocument: `${apiUrl}/api/auth/upload-docs`,
  getDocuments: `${apiUrl}/api/auth/view-docs`,

  //support
  createTicket: `${apiUrl2}/api/ticket/create`,
  getTickets: `${apiUrl2}/api/ticket/getByUserId`,
  verifyAwb: `${apiUrl}/auth/order/verifyAwb`,
  ticketResponse: `${apiUrl2}/api/ticket/get-responses-ticketId`,
  createResponse: `${apiUrl2}/api/ticket/update-response-customer`,

  // promotional
  getPermotionData: `${apiUrl}/auth/order/getPermotionData`,

  //revenue
  getRevenue: `${apiUrl}/auth/revenue/fetch-revenues`,

  // weight discrepancy
  discrepancyFilter: `${apiUrl}/api/auth/discrepancy/master-filter`,

  //wallet
  getTransactions: `https://payments.blitzshipz.com/api/transaction/get-all`,
  getBalance: `https://payments.blitzshipz.com/api/account/get-balance`,
  initiatePayment: `https://payments.blitzshipz.com/api/auth/paytm/payment/initiate`,
  verifyPayment: `https://payments.blitzshipz.com/api/account/paytm-verify-payment`,
}
