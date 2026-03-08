import { useEffect, useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "../../../api"
import { cookies } from "../../../cookie"

import { BtnAuth } from "../ui/btn/BtnAuth"
import { InputToken } from "../ui/input/InputToken"

import { AuthBg } from "../components/AuthBg"
import { AuthTitle } from "../components/AuthTitle"
import { AuthWarning } from "../components/AuthWarning"
import { AlertResponse } from "../../../ui/alert/AlertResponse"
import { Loader } from "../../../components/loader/Loader"


export function VerifyEmail(){
    const data = useRef()
    const clickRef = useRef(false)
    const transitionRef = useRef(null)

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const location = useLocation()
    
    const [updateAlert, setUpdateAlert] = useState()
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({
        mode: "onChange",
        defaultValues:{
            "identifier_token": ""
        }
    })
    
    const {verifyEmailData, refetch, isLoading, error} = useQuery({
        queryKey: ["verify-email-data"],
        enabled: !!data.current,
        staleTime: 0,
        retry: () => {
            reset()
            queryClient.invalidateQueries({queryKey: ["verifyEmailData"]})
        },
        queryFn: async () => {
            const tokens = await api.post(
                "/auth/verify-email", 
                {
                    "recaptcha_token": location.state?.recaptcha_token.recaptcha_token || "", 
                    "identifier_token": data.current.identifier_token
                }
            ).then(r => r.data)
            cookies.set(
                    "access_token", tokens.access_token,
                    {path: "/"}
            )
                cookies.set(
                    "refresh_token", tokens.refresh_token,
                    {path: "/"}
            )
            return navigate("/")
        }
    })

    const onSubmit = (d) => {
        data.current  = d
        refetch()
    }

    useEffect(() => {
        document.addEventListener("keydown", e => e.stopImmediatePropagation())            
        return () => {
            document.removeEventListener("keydown", e => e.stopImmediatePropagation())
        }
    })

    return(<>
        <Helmet>
             <title>Подтверждение почты</title>
        </Helmet>
        <main className="auth">
            <h1 className="title-page">
                Подтверждение почты
            </h1>
            <AuthBg/>
            <div className="auth__container">
                <SwitchTransition mode="out-in">
                    <CSSTransition 
                        classNames="transition" 
                        key={isLoading}
                        nodeRef={transitionRef} 
                        timeout={300}
                    >
                        {isLoading
                            ? <Loader/>
                            : <div className="auth__inner transition-loader" ref={transitionRef}>
                                <AuthTitle title={"Подтверждение почты"}
                                    desc={<>
                                        Проверьте Вашу почту и найдите письмо с токеном подтверждения почты
                                        <br />
                                        Вы сможете авторизоваться в Вашу учетную запись только после подтверждения почты
                                </>}/>
                                <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(onSubmit)}>
                                    <InputToken 
                                        labelTitle={"Токен из письма"}
                                        id={"identifier_token"}
                                        register={register} errors={errors} 
                                        clickRef={clickRef} watch={watch}
                                    />
                                    <BtnAuth isValid={isValid} callback={() => setUpdateAlert(Date.now())}>
                                        Подтвердить почту
                                    </BtnAuth>
                                </form>
                                <AuthWarning/>
                            </div>
                        }
                    </CSSTransition>
                </SwitchTransition>
            </div>
            {isLoading === false &&
                <AlertResponse
                    msg={error?.response?.data} 
                    statusCode={error?.status} 
                    update={updateAlert}
                    prefix={error?.response && "error"}
                />
            }
        </main>
    </>)
}
