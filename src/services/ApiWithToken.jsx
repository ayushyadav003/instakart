import axios from "axios";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

export const ApiWithToken = async ({ url, method, data, params }) => {
  const apiOptions = {
    url,
    method,
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    params,
    data: data,
  };
  try {
    const res = await axios(apiOptions);
    if (res) {
      return res;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      toast.warning("Your token has been expired, Please login again.");
      localStorage.clear();
      window.location.href = "/";
    }
  }
};
