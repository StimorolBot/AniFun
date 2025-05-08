import { useState } from "react"
import { AxiosError } from "axios"

// import { refreshToken } from "../../api/auth"


export const useFetch = ( callback ) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState([])

    const request = async (...args) => {
        try {
            setIsLoading(true)
            await callback(...args)
        } catch (e) {
            setError(e)
        } finally {
            setIsLoading(false)
        }
    }

  return [request, isLoading, error]
}
