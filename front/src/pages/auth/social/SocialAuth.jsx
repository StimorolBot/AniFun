import { memo, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { api } from "../../../config/api"
import { cookies } from "../../../config/cookie"
import { useFetch } from "../../../components/hook/useFetch"

import { AuthBg } from "../../../components/auth/AuthBg"
import { AuthTitle } from "../../../components/auth/AuthTitle"
import { AuthWarning } from "../../../components/auth/AuthWarning"


export const SocialAuth = memo(({url}) => {
    const navigate = useNavigate()
    
    const getUrlParams = () => {
        const params = {}
        window.location.href.split('?')[1].split('&').forEach(pair => {
            const [key, value] = pair.split('=')
            params[key] = decodeURIComponent(value)
        })
        return params
    }

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(url, {params: getUrlParams()})
            .then((r) => {
                cookies.set(
                    "access_token", r.data["access_token"],
                    {path: "/"}
                )
                navigate("/")
            })
        }
    )
    
    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])
    
    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
                <AuthTitle title={"Вы авторизированны"}
                    desc={"Добро пожаловать и приятного просмотра !"}
                />
                <AuthWarning/>            
            </div>
        </main>
    )
})