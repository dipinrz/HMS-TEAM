// import axios from "axios";


// const commonAPI = async(
//   httpMethod: 'GET' | 'POST' | 'PATCH' | 'PUT'|'DELETE',
//   url: string,
//   reqBody?: any
// ) => {
//   const token = localStorage.getItem("authToken");

//   const reqConfig = {
//     method: httpMethod,
//     url,
//     ...(httpMethod === "GET" ? { params: reqBody } : { data: reqBody }),
//     headers: {
//       ...(token && { Authorization: `Bearer ${token}` }),
//       "Content-Type": "application/json",
//     },
//   };

//   try {
//     const response = await axios(reqConfig);
//     return response;
//   } catch (error: any) {
//     if (error?.response?.status === 403) {
//       console.warn("🔐 Token expired or invalid. Logging out...");
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("authUser");
//       window.location.href = "/login";
//     }
//     throw error.response || error;
//   }
// };

// export default commonAPI;





import axios from "axios";

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

const commonAPI = async <T = any>(
  httpMethod: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  url: string,
  reqBody?: any
): Promise<APIResponse<T>> => {
  const token = localStorage.getItem("authToken");

  const reqConfig = {
    method: httpMethod,
    url,
    ...(httpMethod === "GET" ? { params: reqBody } : { data: reqBody }),
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    },
  };

  try {
    const response:any= await axios(reqConfig);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    if (!error.response) {
      console.error("❌ Server unreachable:", error.message);
      window.location.href = "/server-down";
      return { success: false, error: "Server unreachable" };
    }

    if (error.response?.status === 403) {
      console.warn("🔐 Token expired or invalid. Logging out...");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      window.location.href = "/login";
      return { success: false, error: "Token expired", status: 403 };
    }

    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong",
      status: error.response?.status,
    };
  }
};

export default commonAPI;
