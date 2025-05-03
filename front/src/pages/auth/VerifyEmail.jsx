import { useRef } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"

import { api } from "../../api"
import { cookies } from "../../cookie"
import { useFetch } from "../../hook/useFetch"


import { BtnAuth } from "../../ui/btn/BtnAuth"
import { InputToken } from "../../ui/input/InputToken"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthWarning } from "../../components/auth/AuthWarning"
import { TransitionLoader } from "../../transition/TransitionLoader"
import { Error } from "../../ui/popup/Error"


export function VerifyEmail(){
    const clickRef = useRef(false)
    const transitionRef = useRef(null)
    const location = useLocation()
    const token = location.state?.recaptcha_token
    const navigate = useNavigate()
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
                navigate("/")
            })
        }
    )

    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
                <TransitionLoader transitionRef={transitionRef} isLoading={isLoading}>
                    <div className="auth__inner transition-loader" ref={transitionRef}>
                        <AuthTitle title={"Подтверждение почты"}
                            desc={<>
                                Проверьте Вашу почту и найдите письмо с токеном подтверждения почты
                                <br />
                                Вы сможете авторизоваться в Вашу учетную запись только после подтверждения почты
                        </>}/>
                        <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(request)}>
                            <InputToken labelTitle={"Токен из письма"} register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <BtnAuth text={"Подтвердить почту"} isValid={isValid}/>
                        </form>
                        <AuthWarning/>
                    </div>
                </TransitionLoader>
            </div>
            <Error error={error} resetForm={reset}/>
        </main>
    )
}
