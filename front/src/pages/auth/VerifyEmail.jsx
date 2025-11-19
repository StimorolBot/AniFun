import { Helmet } from "react-helmet"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../api"
import { cookies } from "../../cookie"
import { useFetch } from "../../hook/useFetch"

import { BtnAuth } from "../../ui/btn/BtnAuth"
import { InputToken } from "../../ui/input/InputToken"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthWarning } from "../../components/auth/AuthWarning"
import { AlertResponse } from "../../ui/alert/AlertResponse"


export function VerifyEmail(){
    const clickRef = useRef(false)
    const transitionRef = useRef(null)
    const location = useLocation()
    const token = location.state?.recaptcha_token
    const navigate = useNavigate()
    const [updateAlert, setUpdateAlert] = useState()
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({
        mode: "onChange",
        defaultValues:{
            "email_token": ""
        }
    })

    const [request, isLoading, error] = useFetch(
        async (data, event) => {
            event.preventDefault()
            await api.post("/auth/verify-email", {
                "recaptcha_token": token ? token : "", 
                "identifier_token": data.email_token
            })
            .then((r) => {
                cookies.set(
                    "access_token", r.data["access_token"],
                    {path: "/"}
                )
                cookies.set(
                    "refresh_token", r.data["refresh_token"],
                    {path: "/"}
                )
                navigate("/")
            })
        }
    )

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
                                <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(request)}>
                                    <InputToken 
                                        labelTitle={"Токен из письма"} 
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
                    setResponse={reset}
                    prefix={error?.response && "error"}
                />
            }
        </main>
    </>)
}
