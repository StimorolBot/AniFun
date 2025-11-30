import axios from "axios"
import { cookies } from "./cookie"


export const api = axios.create({
    baseURL: "http://localhost:8000", 
    withCredentials: true,
    crossDomain: true,
    httpOnly: true
})

export const refreshToken = async (callback, ...args) => {
    await api.post("/auth/refresh-token")
        .then(async (response) => {
            cookies.set(
                // ! httpOnly cookie
                "access_token", response.data?.access_token,
                {path: "/"}
            )
            await callback(...args)
        })
        .catch((error) => {
            if (error.response.status === 401){
                window.location.pathname = "auth/login"
            }
        })
}
