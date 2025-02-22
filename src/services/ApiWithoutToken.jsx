import axios from 'axios'
import { toast } from 'react-toastify'
// import { toast } from 'react-toastify'

export const ApiWithOutToken = async ({ url, method, data, params }) => {
  const apiOptions = {
    url,
    method,
    params,
    data: data,
  }
  const res = await axios(apiOptions)
  if (res) {
    return res
  }
}
