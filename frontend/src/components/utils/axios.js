import axios from "axios";
import { backendUrl } from "../../constant";

const api =  axios.create({
    baseURL: `${backendUrl}/v1/user/`,
    withCredentials: true
})

export default api;