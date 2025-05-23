import {
  Call,
  Dashboard,
  DragIndicator,
  ProductionQuantityLimits,
  Quiz,
  ShoppingBasket,
  Description,
  AccountBalanceWallet,
  Assessment,
  
} from '@mui/icons-material'
import DiscountIcon from '@mui/icons-material/Discount';
import SellIcon from '@mui/icons-material/Sell'

const userData = JSON.parse(localStorage.getItem('instakart-user-details'))

export const sideBarOption = [
  { title: 'Dashboard', icon: '/images/icons/invoice.png', link: '/dashboard' },
  {
    title: 'Products',
    icon: <ShoppingBasket fontSize="small" />,
    link: '/products',
  },
  {
    title: 'Discounts',
    icon: <DiscountIcon fontSize="small" />,
    link: '/discounts',
  },
  {
    title: 'Order',
    icon: <SellIcon fontSize="small" />,
    link: '/orders',
  },
  {
    title: 'Transactions',
    icon: <AccountBalanceWallet fontSize="small" />,
    link: '/transactions/all',
  },
  {
    title: 'Themes',
    icon: <AccountBalanceWallet fontSize="small" />,
    link: '/themes',
  },
  {
    title: 'My Collection',
    icon: <DragIndicator />,
    link: `/collections/${userData?.businessName.replace(' ', '-')}`,
  },
  { title: 'Invoice', icon: <Description />, link: '/invoice' },
  { title: 'Analytics', icon: <Assessment />, link: '/analytics' },
  { title: 'FAQ', icon: <Quiz />, link: '/faq' },
  { title: 'Support', icon: <Call />, link: '/support' },
]

export const mobileBottomOptions = [
  {
    title: 'Dashboard',
    icon: '/images/icons/layout.png',
    link: '/dashboard/overview',
  },
  {
    title: 'Track',
    icon: '/images/icons/track.png',
    link: '/track-order',
  },
  {
    title: 'Create',
    icon: '/images/icons/createOrder.png',
    link: '/create-order',
  },
  {
    title: 'Mismatch',
    icon: '/images/icons/weight.png',
    link: '/weight-discrepancy',
  },
  {
    title: 'Rate',
    icon: '/images/icons/calculator.png',
    link: '/rate-calculator',
  },
  {
    title: 'COD',
    icon: '/images/icons/cod.webp',
    link: '/cod',
  },

  { title: 'FAQ', icon: '/images/icons/faq.png', link: '/faq' },
  { title: 'Support', icon: '/images/icons/support.png', link: '/support' },
]
export const banksList = [
  { name: 'State Bank of India (SBI)' },
  { name: 'Punjab National Bank' },
  { name: 'Bank of Baroda' },
  { name: 'Canara Bank' },
  { name: 'Union Bank of India' },
  { name: 'Bank of India' },
  { name: 'Indian Bank' },
  { name: 'Central Bank of India' },
  { name: 'Bank of Maharashtra' },
  { name: 'UCO Bank' },
  { name: 'Punjab & Sind Bank' },
  { name: 'Indian Overseas Bank' },
  { name: 'Axis Bank' },
  { name: 'HDFC Bank' },
  { name: 'ICICI Bank' },
  { name: 'Kotak Mahindra Bank' },
  { name: 'IndusInd Bank' },
  { name: 'Yes Bank' },
  { name: 'IDFC FIRST Bank' },
  { name: 'Federal Bank' },
  { name: 'South Indian Bank' },
  { name: 'RBL Bank' },
  { name: 'Bandhan Bank' },
  { name: 'IDBI Bank' },
  { name: 'City Union Bank' },
  { name: 'Tamilnad Mercantile Bank' },
  { name: 'Karnataka Bank' },
  { name: 'Dhanlaxmi Bank' },
  { name: 'Jammu & Kashmir Bank' },
  { name: 'Nainital Bank' },
  { name: 'Saraswat Co-operative Bank' },
  { name: 'Shamrao Vithal Co-operative Bank' },
  { name: 'Abhyudaya Co-operative Bank' },
  { name: 'Bharat Co-operative Bank' },
  { name: 'Cosmos Co-operative Bank' },
  { name: 'TJSB Sahakari Bank' },
  { name: 'Punjab & Maharashtra Co-operative Bank' },
  { name: 'Standard Chartered Bank' },
  { name: 'Citibank' },
  { name: 'HSBC Bank' },
  { name: 'Deutsche Bank' },
  { name: 'DBS Bank' },
  { name: 'Barclays Bank' },
  { name: 'BNP Paribas' },
  { name: 'Bank of America' },
  { name: 'JPMorgan Chase Bank' },
  { name: 'Mizuho Bank' },
  { name: 'MUFG Bank' },
  { name: 'Sumitomo Mitsui Banking Corporation' },
  { name: 'Royal Bank of Scotland' },
  { name: 'Abu Dhabi Commercial Bank' },
  { name: 'Doha Bank' },
  { name: 'Qatar National Bank' },
  { name: 'First Abu Dhabi Bank' },
  { name: 'Mashreq Bank' },
  { name: 'Bank of Bahrain and Kuwait' },
  { name: 'Oman International Bank' },
  { name: 'Shinhan Bank' },
  { name: 'Woori Bank' },
  { name: 'Kookmin Bank' },
  { name: 'Industrial & Commercial Bank of China' },
  { name: 'China Construction Bank' },
  { name: 'Bank of China' },
  { name: 'Agricultural Bank of China' },
  { name: 'Australia and New Zealand Banking Group' },
  { name: 'Westpac Banking Corporation' },
  { name: 'Rabobank' },
  { name: 'Societe Generale' },
  { name: 'Credit Agricole Corporate & Investment Bank' },
  { name: 'UBS Bank' },
  { name: 'Credit Suisse' },
  { name: 'American Express Bank' },
  { name: 'Bank of Nova Scotia' },
  { name: 'State Bank of Mauritius' },
  { name: 'United Overseas Bank' },
  { name: 'Commonwealth Bank of Australia' },
  { name: 'HSBC Bank Oman' },
  { name: 'National Australia Bank' },
  { name: 'PT Bank Maybank Indonesia' },
  { name: 'Bangkok Bank' },
  { name: 'Krung Thai Bank' },
  { name: 'Bank of Ceylon' },
  { name: 'Hatton National Bank' },
  { name: 'Seylan Bank' },
  { name: 'National Development Bank' },
  { name: 'Commercial Bank of Ceylon' },
  { name: 'DFCC Bank' },
  { name: 'Sampath Bank' },
  { name: 'Nations Trust Bank' },
  { name: 'Union Bank of Colombo' },
  { name: 'Pan Asia Banking Corporation' },
  { name: 'Amana Bank' },
  { name: 'Cargills Bank' },
  { name: 'Axis Bank' },
  { name: 'HDFC Bank' },
  { name: 'ICICI Bank' },
  { name: 'Kotak Mahindra Bank' },
  { name: 'IndusInd Bank' },
  { name: 'Yes Bank' },
  { name: 'IDFC FIRST Bank' },
  { name: 'Federal Bank' },
  { name: 'South Indian Bank' },
  { name: 'RBL Bank' },
  { name: 'Bandhan Bank' },
  { name: 'IDBI Bank' },
  { name: 'City Union Bank' },
  { name: 'Tamilnad Mercantile Bank' },
  { name: 'Karnataka Bank' },
  { name: 'Dhanlaxmi Bank' },
  { name: 'Jammu & Kashmir Bank' },
  { name: 'Nainital Bank' },
  { name: 'Saraswat Co-operative Bank' },
  { name: 'Shamrao Vithal Co-operative Bank' },
  { name: 'Abhyudaya Co-operative Bank' },
  { name: 'Bharat Co-operative Bank' },
  { name: 'Cosmos Co-operative Bank' },
  { name: 'TJSB Sahakari Bank' },
  { name: 'Punjab & Maharashtra Co-operative Bank' },
  { name: 'Standard Chartered Bank' },
  { name: 'Citibank' },
  { name: 'HSBC Bank' },
  { name: 'Deutsche Bank' },
  { name: 'DBS Bank' },
  { name: 'Barclays Bank' },
  { name: 'BNP Paribas' },
  { name: 'Bank of America' },
  { name: 'JPMorgan Chase Bank' },
  { name: 'Mizuho Bank' },
  { name: 'MUFG Bank' },
  { name: 'Sumitomo Mitsui Banking Corporation' },
  { name: 'Royal Bank of Scotland' },
  { name: 'Abu Dhabi Commercial Bank' },
  { name: 'Doha Bank' },
  { name: 'Qatar National Bank' },
  { name: 'First Abu Dhabi Bank' },
  { name: 'Mashreq Bank' },
  { name: 'Mashreq Bank' },
  { name: 'Bank of Bahrain and Kuwait' },
  { name: 'Oman International Bank' },
  { name: 'Shinhan Bank' },
  { name: 'Woori Bank' },
  { name: 'Kookmin Bank' },
  { name: 'Industrial & Commercial Bank of China' },
  { name: 'China Construction Bank' },
  { name: 'Bank of China' },
  { name: 'Agricultural Bank of China' },
  { name: 'Australia and New Zealand Banking Group' },
  { name: 'Westpac Banking Corporation' },
  { name: 'Rabobank' },
  { name: 'Societe Generale' },
  { name: 'Credit Agricole Corporate & Investment Bank' },
  { name: 'UBS Bank' },
  { name: 'Credit Suisse' },
  { name: 'American Express Bank' },
  { name: 'Bank of Nova Scotia' },
  { name: 'State Bank of Mauritius' },
  { name: 'United Overseas Bank' },
  { name: 'Commonwealth Bank of Australia' },
  { name: 'HSBC Bank Oman' },
  { name: 'National Australia Bank' },
  { name: 'PT Bank Maybank Indonesia' },
  { name: 'Bangkok Bank' },
  { name: 'Krung Thai Bank' },
  { name: 'Bank of Ceylon' },
  { name: 'Hatton National Bank' },
  { name: 'Seylan Bank' },
  { name: 'National Development Bank' },
  { name: 'Commercial Bank of Ceylon' },
  { name: 'DFCC Bank' },
  { name: 'Sampath Bank' },
  { name: 'Nations Trust Bank' },
  { name: 'Union Bank of Colombo' },
  { name: 'Pan Asia Banking Corporation' },
  { name: 'Amana Bank' },
  { name: 'Cargills Bank' },
]

export const dashboardInner = [
  {
    selector: 'overview',
    title: 'Overview',
    link: '/dashboard/overview',
  },
  {
    selector: 'pickups',
    title: 'Orders',
    link: '/dashboard/pickups?item=10&page=1',
  },
  {
    selector: 'NDR',
    title: 'NDR',
    link: '/dashboard/NDR',
  },
  {
    selector: 'RTO',
    title: 'RTO',
    link: '/dashboard/RTO?item=10&page=1',
  },
  // {
  //   selector: 'COD',
  //   title: 'COD',
  //   link: '/dashboard/COD?item=10&page=1',
  // },
  {
    selector: 'cancelled-orders',
    title: 'Cancelled',
    link: '/dashboard/cancelled-orders?item=10&page=1',
  },
]
export const supportCategory = ['Operation', 'Technical', 'Finanace', 'Other']
export const supportSubCategory = {
  Operation: [
    'Delay in pickup',
    'Order not delivered',
    'Shipment showing lost/damage in tracking panel',
    'Return goods not received',
    'NDR reattempt request',
    'Weight discrepancy',
    'Cancel pickup request',
  ],
  Technical: [
    'Unable to add warehouse',
    'Unable to verify my email',
    'Unable to verify my document',
    'Issue in creating order',
    'issue in placing order',
  ],
  Finanace: [
    'COD payment not received yet',
    'Invoice not generated',
    'Issue in Invoice',
    'Refund for the lost/damange not received',
  ],
  Other: [
    "Issue with the pickup/delivery boy's behaviour",
    'Issue with sales team support',
    'My issue is not listed',
  ],
}
export const faq = [
  {
    ques: 'How do I create an order on your website?',
    ans: [
      'To create an order:',
      '1. Add a warehouse and complete the required documents (PAN or GST number).',
      '2. Go to "Create Order" and select the warehouse.',
      "3. Enter the seller's name and address for the shipping label.",
      '4. Then, go to "Drop Details" to enter the recipient’s name, address, and contact information.',
      '5. Provide product info such as weight, measurements, and the price of the product.',
      '6. Click "Create" to finalize the order.',
    ],
  },
  {
    ques: 'How do I ship an order?',
    ans: [
      'To ship an order:',
      '1. Create an Order: First, ensure you have created an order.',
      '2. Access Manifest Orders: Go to the "Manifest Order" tab under "Create Order" and find the order you wish to ship.',
      '3. Select Payment Option: Choose the payment option and select a shipping vendor based on the best price and rating.',
      '4. Complete Payment: Proceed to the payment gateway to complete your payment.',
      '5. Download Shipping Label: Go to "My Dashboard" > "Orders" to find your order, download the shipping label, and attach it to your package.',
      '6. Await Pickup: Wait for the pickup team to collect your order.',
    ],
  },
  {
    ques: 'How do I register for BLITZSHIPZ?',
    ans: [
      'To register for BLITZSHIPZ:',
      '1. Go to our official website at [www.blitzshipz.com](http://www.blitzshipz.com).',
      '2. Click on the "Login" or "Sign Up" page.',
      '3. Enter your personal details, such as name, email address, and phone number.',
      '4. Check your email for a verification link and click it to confirm your registration.',
      '5. Once verified, log in with your credentials and complete additional documents, such as PAN and GST numbers.',
    ],
  },
  {
    ques: 'Why do I need to provide my PAN and GST details?',
    ans: [
      'Providing your PAN and GST details is necessary for compliance with tax regulations and to ensure smooth processing of payments and services. These details help us verify your business identity and are solely required for billing purposes at the end of the month.',
    ],
  },
  {
    ques: 'How do I print a shipping label?',
    ans: [
      'To print a shipping label, follow these steps:',
      '1. Log in to your BlitzShipz account.',
      '2. Navigate to Dashboard > Orders.',
      '3. Select the order for which you want to print the label.',
      '4. Click on the "Print Shipping Label" option.',
      '5. Review the label details and confirm.',
      '6. Download the label file if necessary.',
      '7. Open the downloaded file and print it using your printer.',
      'If you encounter any issues, please contact our customer support for assistance at info@blitzshipz.com.',
    ],
  },
  {
    ques: 'What is NDR?',
    ans: [
      'NDR stands for Non-Delivery Report. It is a notification indicating that a delivery attempt was made but the package was not successfully delivered to the recipient. This report provides details about why the delivery failed and often includes instructions on how to resolve the issue or arrange for a redelivery.',
    ],
  },
  {
    ques: 'How should I act on an NDR (Non-Delivery Report)?',
    ans: [
      'First, check the NDR list on your Dashboard by navigating to Dashboard > NDR. Review the details to understand the reason for non-delivery. Based on this information, take the necessary actions, such as updating the recipient’s availability, address, or phone number. After making the required changes, click "Reattempt" to schedule a new delivery attempt for the next day.',
      'If you need further assistance, please contact our customer support team at info@blitzshipz.com.',
    ],
  },
  {
    ques: 'When will I receive my COD payment?',
    ans: [
      "We remit COD payments on a weekly basis. Payments are processed every Friday, so you will receive the accumulated COD payments for products delivered from Monday to Sunday of the current week on the following week's Friday.",
    ],
  },
  {
    ques: 'I did not receive my COD payment. What should I do?',
    ans: [
      'Check for Bill Pendency: Verify if there are any pending issues related to weight discrepancies, returns to origin, or other reasons that might affect payment.',
      'Clear Pendency: Resolve any outstanding issues or invoices and send the updated information to info@blitzshipz.com.',
      'Contact Customer Support: If your payment is still delayed after taking the above steps, call our customer support representatives for further assistance. We are committed to resolving any issues and ensuring your payment is processed promptly.',
    ],
  },
  {
    ques: 'What is RTO and do we need to pay for it?',
    ans: [
      'RTO stands for Return to Origin. It occurs when a delivery attempt fails and the package is returned to the sender. Common reasons for RTO include incorrect address details, recipient unavailability, or refusal of delivery.',
      'As for payment:',
      'Charges: The cost of RTO is entirely liable on you. Charges may vary depending on the specific courier vendors involved.',
      'Responsibility: Please review your service agreement or contact customer support for detailed information on how RTO charges are applied and managed. If you have further questions or need assistance, please reach out to our customer support team at info@blitzshipz.com.',
    ],
  },
  {
    ques:
      'What is the Rate Calculator and how does it work? Is there any grade category?',
    ans: [
      'The Rate Calculator is a tool provided by BlitzShipz to calculate the rates charged by different vendors for a particular pair of pincodes. It considers features such as COD/PPD and weight charges to give you accurate shipping cost estimates.',
      'Grade Categories: Yes, we offer four categories based on the volume of your business:',
      'Silver: No limit on the number of parcels.',
      'Gold: For up to 100 parcels per month.',
      'Diamond: For 300 to 800 parcels per month.',
      'Platinum: For over 1000 parcels per month.',
      'These categories help tailor services and rates according to your shipping needs.',
      'If you need assistance or have more questions about the Rate Calculator, please contact our customer support team at info@blitzshipz.com.',
    ],
  },
  {
    ques:
      'What compensation am I entitled to if my goods are delivered in a damaged condition?',
    ans: [
      "In the event of lost, damaged, pilfered, tampered, or leaked goods, Blitzshipz is liable to pay compensation up to a maximum of Rs. 2,500 or 50% of the goods' value, whichever is lower, for both forward and reverse shipments. Please ensure that you file your complaint within 20 days of delivery through a ticket in the Support section at Blitzshipz to be eligible for compensation.",
    ],
  },
  {
    ques:
      'What are the customer standards or grades, and how can we upgrade our status to a higher grade?',
    ans: [
      'The customer standards or grades are categorized as follows:',
      'Silver: No limit on the number of parcels.',
      'Gold: For up to 100 parcels per month.',
      'Diamond: For 300 to 800 parcels per month.',
      'Platinum: For over 1,000 parcels per month.',
      'These categories help tailor services and rates according to your shipping needs. To upgrade your plan, please call our customer support and provide the number of parcels you deliver per month to get certified for the appropriate category.',
    ],
  },
]
export const vendorList = {
  DL: 'Delhivery',
  DT: 'DTDC',
  DX: 'Delhivery Air',
}
export const rateCalDays = {
  ZONEA: '2 day',
  ZONEB: '3 days',
  ZONEC: '3-4 days',
  ZONED: '4-5 days',
  ZONEE: '5-6 days',
}
export const pickupRating = {
  DL: '4.3',
  AM: '4.3',
  EC: '4.3',
}
export const destinationRating = {
  DL: '4.4',
  AM: '4.3',
  EC: '4.3',
}
export const promotionalData = [
  {
    grade: 'Silver',
    target: 'Target 100 per month',
    discount: ['25%', '10%', '15%'],
  },
  {
    grade: 'Gold',
    target: 'Target 300 per month',
    discount: ['20%', '8%', '12%'],
  },
  {
    grade: 'Diamond',
    target: 'Target 500 per month',
    discount: ['12%', '6%', '8%'],
  },
  {
    grade: 'Platinum',
    target: 'Target 1000 per month',
    discount: ['10%', '3%', '5%'],
  },
]
export const rateTermsAndCondition = [
  'Above rates are inclusive of 18% GST.',
  'Chargeable weight will be the higher of actual or volumetric weight.',
  'Volumetric weight is calculated as LBH/5000.',
  'Maximum liability for forward or reverse shipment will be ₹2500 or 50% of the goods value, whichever is lower.',
  'Any weight dispute due to incorrect weight declaration cannot be claimed.',
  'Reverse or RTO charges will be the same as forward charges.',
  'Fixed COD charge or COD % of the order value, whichever is higher, will be taken while calculating the COD fee.',
]
// "Above rates are inclusive of 18% GST.",
// "Chargeable weight will be the higher of actual or volumetric weight.",
// "Volumetric weight is calculated as LBH/5000.",
// "Maximum liability for forward or reverse shipment will be ₹2500 or 50% of the goods value, whichever is lower.",
// "Any weight dispute due to incorrect weight declaration cannot be claimed.",
// "Reverse or RTO charges will be the same as forward charges.",
// "Fixed COD charge or COD % of the order value, whichever is higher, will be taken while calculating the COD fee.",
// 'Dead/Dry weight or volumetric weight whichever is higher will be taken while calculating the freight rates.',
// 'Fixed COD charge or COD % of the order value whichever is higher will be taken while calculating the COD fee.',
// 'Above prices are inclusive of GST.',
// 'The above pricing is subject to change based on fuel surcharges and courier company base rates.',
// 'Return charges may apply over and above the freight fee incase of E-com Express.',
// 'Volumetric weight is calculated LxBxH/5000 for all courier companies except for Fedex Surface, Aramex, Fedex Surface Light and Gati Surface. In case of Fedex surface, volumetric weight is calculated as LxBxH/4500, for Aramex, it is LxBxH/6000, for Fedex Surface Light, it is LxBxH/4500 and for Gati Surface, it is LxBxH/4500 (length, breadth, height has to be taken in Centimeters and divided by denominator, this will give the value in Kilograms).',
// 'The maximum liability if any is limited to whatever compensation the logistics partner offers to Company in event of a claim by the Merchant, provided such claim is raised by the Merchant within one (1) month from the date of such damage or loss or theft.',

// site key -  6LdPgK8qAAAAAGrfcqCBochAu_zGbR-vT3theN7Y
// secret key - 6LdPgK8qAAAAAFGgdQdgkz-qj7CQ0GsclJqX3GMy
