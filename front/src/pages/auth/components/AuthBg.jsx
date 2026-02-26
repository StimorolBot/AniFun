import { memo, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../api"
import { Loader } from "../../../components/loader/Loader"

import "./style/auth_bg.sass"


export const AuthBg = memo (() => {
    const transitionRef = useRef()
    
    const {data: ImgData, isLoading, error} = useQuery({
        queryKey: ["auth-background"],
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return await api.get("/auth/background-img").then(r => r.data)
        }
    })
    
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
                        : <img className="auth__bg" src={ImgData}/>
                    }
                </div>
            </CSSTransition>
        </SwitchTransition>
    )
})
