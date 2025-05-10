import { useRef } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { api } from "../../api"
import { cookies } from "../../cookie"
import { useFetch } from "../../hook/useFetch"

import { InputEmail } from "../../ui/input/InputEmail"
import { InputPassword } from "../../ui/input/InputPassword"
import { BtnAuth } from "../../ui/btn/BtnAuth"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthSocial } from "../../components/auth/AuthSocial"
import { AuthWarning } from "../../components/auth/AuthWarning"
import { TransitionLoader } from "../../transition/TransitionLoader"
import { Error } from "../../ui/alert/Error"


export function Login(){    
    const navigate = useNavigate()
    const transitionRef = useRef(null)
    const clickRef = useRef(false)
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({
        mode: "onChange",
        defaultValues:{
            "identifier": "",
            "password": ""
        }
    })
        
    const [request, isLoading, error] = useFetch(
        async (data, event) => {
            event.preventDefault()
            await api.patch("/auth/login", data)
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
                        <AuthTitle title={"Авторизация"} 
                            desc={<>
                                Введите имя пользователя и пароль, чтобы войти в свою учетную запись
                                <br/>
                                Также, можно авторизоваться через социальные сети
                            </>}
                        />
                        <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(request)}>
                            <InputEmail register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <InputPassword register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <BtnAuth text={"Авторизация"} isValid={isValid}/>
                        </form>
                        <AuthSocial/>
                        <ul className="auth__link-list">
                            <li>
                                <Link className="auth__link" to={"/auth/register"}>
                                    Регистрация
                                </Link>
                            </li>
                            <li>
                                <Link className="auth__link" to={"/auth/reset-password-token"}>
                                    Восстановить пароль
                                </Link>
                            </li>
                        </ul>
                        <AuthWarning/>
                    </div>
                </TransitionLoader>            
            </div>
            <Error error={error} resetForm={reset}/>
        </main>
    )
}
