import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { BtnAuth } from "../../ui/btn/BtnAuth"
import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthSocial } from "../../components/auth/AuthSocial"
import { AuthWarning } from "../../components/auth/AuthWarning"

import { Error } from "../../ui/alert/Error"
import { InputEmail } from "../../ui/input/InputEmail"
import { TransitionLoader } from "../../transition/TransitionLoader"


export function ResetPasswordToken(){
    const clickRef = useRef(null)
    const navigate = useNavigate()
    const transitionRef = useRef(null)
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({
        mode: "onChange",
        defaultValues:{
            "identifier": ""
        }
    })
    
    const [request, isLoading, error] = useFetch(
        async (data, event) => {
            event.preventDefault()
            await api.post("/auth/token-password", data)
            .then((r) => {
                navigate("/auth/reset-password")
            })
        }
    )
    
    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
                <TransitionLoader transitionRef={transitionRef} isLoading={isLoading}>
                    <div className="auth__inner transition-loader" ref={transitionRef}>
                        <AuthTitle title={"Восстановление пароля"} 
                            desc={<>
                                Вы можете восстановить забытый пароль и сгенировать новый.
                                <br/>
                                Введите Вашу почту, на которую вы зарегистрировали аккаунт, мы пришлем 
                                Вам письмо с дальнейшими инструкциями.
                            </>}
                        />
                        <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(request)}>
                            <InputEmail register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <BtnAuth text={"Восстановить пароль"} isValid={isValid}/>
                        </form>
                        <AuthSocial/>
                        <ul className="auth__link-list">
                            <li>
                                <Link className="auth__link" to={"/auth/reset-password"}>
                                    У меня уже есть токен
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
