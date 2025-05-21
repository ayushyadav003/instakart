import axios from 'axios'

export const ApiWithToken = async ({ url, method, data, params }) => {
  console.log(url,method,data,params,'apiwithtoken  ')
  const userData = JSON.parse(localStorage.getItem('instakart-user-details'))
  console.log("token",userData)
  const apiOptions = {
    url,
    method,
    headers: { Authorization: `Bearer ${userData?.token}` },
    params,
    data: data,
  }
  try {
    const res = await axios(apiOptions)
    console.log(res, 'response')
    if (res) {
      return res
    }

  } catch (error) {
    return error
  }
}
