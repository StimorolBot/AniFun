import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"

import { api } from "/src/config/api"
import { cookies } from "../../config/cookie"
import { useFetch } from "../../components/hook/useFetch"

import { Error } from "../../components/ui/popup/Error"
import { BtnAuth } from "../../components/ui/btn/BtnAuth"
import { InputToken } from "../../components/ui/input/InputToken"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthWarning } from "../../components/auth/AuthWarning"


export function VerifyEmail(){
    const clickRef = useRef(false)
    const location = useLocation()
    const navigate = useNavigate()
    const [errorData, setErrorData] = useState({"status_code": null, "detail": "", "is_hidden": true})
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({mode: "onChange"})

    const [request, isLoading, error] = useFetch(
        async (data, event) => {
            event.preventDefault()
            await api.post("/auth/verify-email", {
                "recaptcha_token": location.state?.recaptcha_token,
                "email_token": data.email_token
            })
            .then((r) => {
                cookies.set(
                    "access_token", r.data["access_token"],
                    {path: "/"}
                )
                navigate("/")
            })
            // .cath((e) => {
            //     setErrorData({"status_code": e?.response.status,"detail": e?.response?.data?.detail, "is_hidden": false})
            //     reset()
            // }

            // )
        }
    )

    console.log(error)
    
    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
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
            <Error errorData={errorData} setErrorData={setErrorData}/>
        </main>

      
    )
}
