import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { api } from "../../config/api"
import { cookies } from "../../config/cookie"
import { useFetch } from "../../components/hook/useFetch"

import { InputEmail } from "../../components/ui/input/InputEmail"
import { InputPassword } from "../../components/ui/input/InputPassword"
import { BtnAuth } from "../../components/ui/btn/BtnAuth"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthSocial } from "../../components/auth/AuthSocial"
import { AuthWarning } from "../../components/auth/AuthWarning"
import { Loader } from "../../components/ui/loader/Loader"
import { CSSTransition } from "react-transition-group"
import { Error } from "../../components/ui/popup/Error"


export function Login(){    
    const navigate = useNavigate()
    const loadingRef = useRef(null)
    const clickRef = useRef(false)
    const [errorData, setErrorData] = useState({"status_code": null, "detail": "", "is_hidden": true})
    const {register, handleSubmit, watch, formState: {errors, isValid}, resetField} = useForm({mode: "onChange"})
        
    const [request, isLoading, error] = useFetch(
        async (data, event) => {
            event.preventDefault()
            await api.post("/auth/login", data)
            .then((r) => {
                cookies.set(
                    "refresh_token", r.data["access_token"],
                    {path: "/"}
                )
                navigate("/")
            })
            .catch((e) => {
                setErrorData({"status_code": e?.response.status,"detail": e?.response?.data?.detail, "is_hidden": false})
                resetField("password")
            })
        }
    )

    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
                <Loader isLoading={isLoading} loaderMsg={<>Пожалуйста, подождите. <br />Идет проверка данных</>}/>
                <CSSTransition classNames="auth__inner" nodeRef={loadingRef} in={isLoading} timeout={400}>
                    <div className="auth__inner" ref={loadingRef}>
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
                                <Link className="auth__link" to={"/auth/auth-token"}>
                                    Восстановить пароль
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
