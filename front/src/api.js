import axios from "axios"

import { cookies } from "./cookie"

export const api = axios.create({
	baseURL: "http://localhost:8000",
	withCredentials: true,
	crossDomain: true,
	httpOnly: true,
})

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			originalRequest.url !== "/auth/refresh"
		) {
			originalRequest._retry = true
			try {
				const accessToken = await api
					.post("/auth/refresh")
					.then((r) => r.data?.access_token)

				cookies.set("access_token", accessToken, { path: "/" })

				return api.request(originalRequest)
			} catch (e) {
				cookies.remove("access_token")
				cookies.remove("refresh_token")

				return Promise.reject(e)
			}
		}
		return Promise.reject(error)
	},
)
