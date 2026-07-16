import api from "./api";

export const createBooking = async (data: any) => {
  console.log("Sending booking:", data);

  try {
    // 1. Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    // 2. Add the token to the headers IF it exists
    const config = token 
      ? { headers: { Authorization: `Bearer ${token}` } } 
      : {};

    const response = await api.post("/bookings", data, config);

    console.log("Booking created:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Booking failed:", error.response?.data || error.message);
    throw error;
  }
};