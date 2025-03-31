import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { CSSTransition } from "react-transition-group"

import { api } from "/src/config/api"
import { useFetch } from "/src/components/hook/useFetch"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthSocial } from "../../components/auth/AuthSocial"
import { AuthWarning } from "../../components/auth/AuthWarning"
import { BtnAuth } from "../../components/ui/btn/BtnAuth"

import { InputEmail } from "../../components/ui/input/InputEmail"
import { InputPassword } from "../../components/ui/input/InputPassword"
import { InputName } from "../../components/ui/input/InputName"
import { Loader } from "../../components/ui/loader/Loader"
import { Error } from "../../components/ui/popup/Error"


export function Register(){
    const navigate = useNavigate()
    const clickRef = useRef(false)
    const registerRef = useRef(null)
    const [errorData, setErrorData] = useState({"status_code": null, "detail": "", "is_hidden": true})
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({mode: "onChange"})
    
    const [request, isLoading, error] = useFetch(
        async (data, event) => {
            event.preventDefault()
            await api.post("/auth/register", data)
            .then((r) => {
                navigate("/auth/verify-email", {state: {recaptcha_token: r.data.recaptcha_token}})
            })
            .cath((e) => {
                setErrorData({"status_code": e?.response.status,"detail": e?.response?.data?.detail, "is_hidden": false})
                reset()
            })
        }
    )

    const validFrom = async (data, event) => {
        if (data.password !== data.password_confirm)
            setErrorData({"status_code": 400, "detail": "Пароль не совпадают", "is_hidden": false})
        else
            await request(data, event)
    }

    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
                <Loader isLoading={isLoading} loaderMsg={<>Пожалуйста, подождите. <br />Идет проверка данных</>}/>
                <CSSTransition classNames="auth__inner" nodeRef={registerRef} in={isLoading} timeout={400}>
                    <div className="auth__inner" ref={registerRef}>
                        <AuthTitle title={"Регистрация"} 
                            desc={<>
                                Введите Ваши данные, чтобы создать свою учетную запись
                                <br/>
                                Также, можно зарегистрироваться через социальные сети
                            </>}
                        />
                        <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(validFrom)}>
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
                </CSSTransition>
            </div>
            <Error errorData={errorData} setErrorData={setErrorData}/>
        </main>
    )
}
