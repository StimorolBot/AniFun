import { useRef } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"

import { api } from "../../config/api"
import { useFetch } from "../../components/hook/useFetch"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { BtnAuth } from "../../components/ui/btn/BtnAuth"

import { InputToken } from "../../components/ui/input/InputToken"
import { InputPassword } from "../../components/ui/input/InputPassword"


export function ResetPassword(){
    const clickRef = useRef(false)
    const {register, handleSubmit, watch, formState: {errors, isValid}, resetField} = useForm({mode: "onChange"})

    const [request, isLoading, error] = useFetch(
        async (data, event) => {
            event.preventDefault()
            await api.post("", data)
        }
    ) 
    
    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
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
                        <Link className="auth__link" to={"/auth/auth-token"}>
                            Повторно выслать письмо с токеном
                        </Link>
                    </li>
                </ul>
            </div>
        </main>  
    )
}
