import imageToBase64 from 'image-to-base64'
import { apiConfig } from '../services/ApiConfig'
import { ApiWithToken } from '../services/ApiWithToken'

export const fetcPostOffice = async (pin) => {
  if (!pin) {
    return
  }
  try {
    const apiOptions = {
      url: apiConfig.postOffice,
      method: 'GET',
      params: {
        pinCode: pin,
      },
    }
    const response = await ApiWithToken(apiOptions)
    if (response?.status == 200) {
      // const pincodeData = response?.data?.results[0]?.address_components || []
      // let postOffice = {}

      // if (pincodeData?.length > 0) {
      //   pincodeData.forEach((item) => {
      //     if (item.types.includes('locality')) {
      //       postOffice.city = item.long_name
      //     }
      //     if (item.types.includes('administrative_area_level_1')) {
      //       postOffice.state = item.long_name
      //     }
      //   })
      // }
      const postOffice = response?.data[0]?.PostOffice[0]

      return postOffice
    }
  } catch (error) {
    console.log(error)
  }
}
