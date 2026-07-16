import api from "@/lib/axios"; // (Or wherever your axios instance is)

export async function getServices() {
  try {
    // If your Next.js route is in app/api/services, this should be api.get("/services") 
    // assuming your baseURL already includes "/api"
    const response = await api.get("/services");
    return response.data;
  } catch (error: any) {
    // This will tell us EXACTLY why it's failing
    if (error.response) {
      console.error("Backend returned status:", error.response.status);
      console.error("Backend returned data:", error.response.data);
    } else if (error.request) {
      console.error("No response from backend. Is the server running?", error.message);
    } else {
      console.error("Error setting up request:", error.message);
    }
    
    // Return an empty array so the form doesn't crash while we debug
    return []; 
  }
}