
// api.ts

// api.ts

// const API_BASE_URL = 'http://localhost:5000';

let API_BASE_URL: string; 

if (process.env.NODE_ENV === "production") {
  API_BASE_URL = "https://back-end-erp-production.up.railway.app";
} else {
  API_BASE_URL = "http://localhost:5000";
}

const api = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  return response;
};

export default api;





// import axios from "axios";

// let baseURL;

// if (process.env.NODE_ENV === "production") {
//   baseURL = "https://back-end-erp-production.up.railway.app/";
// } else {
//   baseURL = "http://localhost:5000/";
// }

// const api = axios.create({
//   baseURL: baseURL,
// });

// export default api;






// const userToken = Cookies.get("userToken");

// api.interceptors.request.use(async config => {

//   const userToken = await Cookies.get("userToken");
//   const token = JSON.parse(userToken)

//   config.headers.authorization =  `Bearer ${token}`

//   return config

// })