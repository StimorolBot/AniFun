import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { BtnAuth } from "../../ui/btn/BtnAuth"

import { InputToken } from "../../ui/input/InputToken"
import { InputPassword } from "../../ui/input/InputPassword"
import { TransitionLoader } from "../../transition/TransitionLoader"
import { Error } from "../../ui/alert/Error"


export function ResetPassword(){
    const navigate = useNavigate()
    const clickRef = useRef(false)
    const transitionRef = useRef(null)
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({
        mode: "onChange",
        defaultValues:{
            "email_token": "",
            "password": "",
            "password_confirm": ""
        }
    })

    const [request, isLoading, error] = useFetch(
        async (data, event) => {
            event.preventDefault()
            await api.patch("/auth/reset-password", data)
            .then(() => {
                navigate("/auth/login")
            })
        }
    )

    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
                <TransitionLoader transitionRef={transitionRef} isLoading={isLoading}>
                    <div className="auth__inner transition-loader" ref={transitionRef}>
                        <AuthTitle title={"Новый пароль"}
                            desc={<>
                                Вы можете создать новый пароль для Вашей учетной записи
                                <br />
                                Проверьте Вашу почту и найдите письмо с токеном восстановления пароля
                            </>}
                        />
                        <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(request)}>
                            <InputToken register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <InputPassword register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <InputPassword 
                                id={"password_confirm"} labelTitle={"Повторите пароль"} register={register} 
                                errors={errors} clickRef={clickRef} watch={watch}
                            />
                            <BtnAuth text={"Сохранить новый пароль"} isValid={isValid}/>
                        </form>
                        <ul className="auth__link-list">
                            <li>
                                <Link className="auth__link" to={"/auth/login"}>
                                    Авторизация
                                </Link>
                            </li>
                            <li>
                                <Link className="auth__link" to={"/auth/reset-password-token"}>
                                    Повторно выслать письмо с токеном
                                </Link>
                            </li>
                        </ul>
                    </div>
                </TransitionLoader>
            </div>
            <Error error={error} resetForm={reset}/>
        </main>  
    )
}
