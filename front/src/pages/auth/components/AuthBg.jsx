import { memo, useEffect, useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"
import { Loader } from "../../../components/loader/Loader"

import "./style/auth_bg.sass"


export const AuthBg = memo (() => {
    const [response, setResponse] = useState({"":""})
    const transitionRef = useRef()
    
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
        <SwitchTransition mode="out-in">
            <CSSTransition 
                classNames="transition" 
                key={isLoading}
                nodeRef={transitionRef} 
                timeout={300}
            >
                <div className="auth__bg-inner transition" ref={transitionRef}>
                    {isLoading
                        ? <Loader/>
                        : <img className="auth__bg" src={`data:image/jpeg;base64,${Object.values(response)[randomIndex]}`} alt="auth-bg" />
                    }
                </div>
            </CSSTransition>
        </SwitchTransition>
    )
})
