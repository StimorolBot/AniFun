import { memo, useEffect, useState } from "react"

import { api } from "../../config/api"
import { useFetch } from "../hook/useFetch"
import { Loader } from "../../components/ui/loader/Loader"

import "./style/auth_bg.sass"


export const AuthBg = memo (() => {
    const [response, setResponse] = useState({"":""})
    
    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get("/auth/background-img").then((r) => setResponse(r.data))
        }
    )

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])
    
    const randomIndex =  Math.floor(Math.random() * Object.keys(response).length)
    
    return(
        <div className="auth__bg-inner">
            {isLoading
                ? <Loader/>
                :<img className="auth__bg" src={`data:image/jpeg;base64,${Object.values(response)[randomIndex]}`} alt="auth-bg" />
            }
        </div>
    )
})
