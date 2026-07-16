import api from "./api";


export const getBookings = async()=>{

    const response = await api.get("/bookings");

    return response.data;

};



export const getAdminServices = async()=>{

    const response = await api.get("/services");

    return response.data;

};

export const updateBookingStatus = async(
    id:number,
    data:any
)=>{

    const response = await api.patch(
        `/bookings/${id}/status`,
        data
    );

    return response.data;

}



export const cancelBooking = async(
    id:number
)=>{

    const response = await api.patch(
        `/bookings/${id}/cancel`
    );

    return response.data;

}

export const createService = async(data:FormData)=>{

    const response = await api.post(
        "/services",
        data,
    );

    return response.data;
}

export const updateService = async(
    id:number,
    data:any
)=>{

    const response = await api.patch(
        `/services/${id}`,
        data
    );

    return response.data;

};



export const deleteService = async(
    id:number
)=>{

    const response = await api.delete(
        `/services/${id}`
    );

    return response.data;

};