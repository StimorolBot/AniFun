import { useRef } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthSocial } from "../../components/auth/AuthSocial"
import { AuthWarning } from "../../components/auth/AuthWarning"
import { BtnAuth } from "../../ui/btn/BtnAuth"

import { InputEmail } from "../../ui/input/InputEmail"
import { InputPassword } from "../../ui/input/InputPassword"
import { InputName } from "../../ui/input/InputName"
import { TransitionLoader } from "../../transition/TransitionLoader"
import { Error } from "../../ui/popup/Error"


export function Register(){
    const navigate = useNavigate()
    const clickRef = useRef(false)
    const registerRef = useRef(null)
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({
        mode: "onChange",
        defaultValues:{
            "user_name": "",
            "identifier": "",
            "password": "",
            "password_confirm": ""
        }
    })
    
    const [request, isLoading, error] = useFetch(
        async (data, event) => {
            event.preventDefault()
            await api.post("/auth/register", data)
            .then((r) => {
                navigate("/auth/verify-email", {state: {recaptcha_token: r.data.recaptcha_token}})
            })
        }
    )

    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
                <TransitionLoader transitionRef={registerRef} isLoading={isLoading}>
                    <div className="auth__inner transition-loader" ref={registerRef}>
                        <AuthTitle title={"Регистрация"} 
                            desc={<>
                                Введите Ваши данные, чтобы создать свою учетную запись.
                                <br/>
                                Также, можно зарегистрироваться через социальные сети
                            </>}
                        />
                        <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(request)}>
                            <InputName register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <InputEmail register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <InputPassword register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <InputPassword id={"password_confirm"} labelTitle={"Повторите пароль"} 
                                register={register} errors={errors} clickRef={clickRef} watch={watch}
                            />
                            <BtnAuth text={"Зарегистрироваться"} isValid={isValid}/>
                        </form>
                        <AuthSocial/>
                        <ul className="auth__link-list">
                            <li>
                                <Link className="auth__link" to={"/auth/verify-email"}>
                                    У меня уже есть токен верификации
                                </Link>
                            </li>
                            <li>
                                <Link className="auth__link" to={"/auth/reset-password-token"}>
                                    Восстановить пароль
                                </Link>
                            </li>
                            <li>
                                <Link className="auth__link" to={"/auth/login"}>
                                    Авторизоваться
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
