import api from "./api";

export const getServices = async () => {
  try {
    const response = await api.get("/services");
    return response.data;
  } catch (error: any) {
    // FIXED: Now it will print exactly why it failed (e.g., 'Network Error' or 'ECONNREFUSED')
    console.error(
      "Services API Error:", 
      error.response?.data || error.message || "Server unreachable"
    );

    // Return an empty array so Next.js doesn't crash the page
    return []; 
  }
};