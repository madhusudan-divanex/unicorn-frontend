import axios from "axios"
import { base_url } from "../baseUrl"

export const getApiData=async(endpoint)=>{
    const res=await axios.get(`${base_url}/${endpoint}`,{
        timeout: 20000 
    })
    return res.data
}
export const getSecureApiData=async(endpoint)=>{
const token=JSON.parse(localStorage.getItem('token'))
    const res=await axios.get(`${base_url}/${endpoint}`,{
        headers:{
            'Token':token
        }
    })
    return res.data
}
export const postApiData=async(endpoint,data)=>{
    const res=await axios.post(`${base_url}/${endpoint}`,data)
    return res.data
}
export const updateApiData=async(endpoint,data)=>{
const token=JSON.parse(localStorage.getItem('token'))

    const res=await axios.put(`${base_url}/${endpoint}`,data,{
        headers:{
            'Token':token
        }
    })
    return res.data
}
export const securePostData=async(endpoint,data)=>{
const token=JSON.parse(localStorage.getItem('token'))

    const res=await axios.post(`${base_url}/${endpoint}`,data,{
        headers:{
            'Token':token
        }
    })
    return res.data
}
export const deleteApiData=async(endpoint)=>{
const token=JSON.parse(localStorage.getItem('token'))

    const res=await axios.delete(`${base_url}/${endpoint}`,{
        headers:{
            'Token':token
        }
    })
    return res.data
}