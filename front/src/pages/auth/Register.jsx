import { Helmet } from "react-helmet"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { OAuth } from "../../components/auth/OAuth"
import { AuthWarning } from "../../components/auth/AuthWarning"
import { BtnAuth } from "../../ui/btn/BtnAuth"

import { InputEmail } from "../../ui/input/InputEmail"
import { InputPassword } from "../../ui/input/InputPassword"
import { InputName } from "../../ui/input/InputName"
import { AlertResponse } from "../../ui/alert/AlertResponse"
import { Loader } from "../../components/loader/Loader"


export function Register(){
    const navigate = useNavigate()
    const clickRef = useRef(false)
    const transitionRef = useRef(null)
    const [updateAlert, setUpdateAlert] = useState()
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
    
    return(<>
        <Helmet>
            <title>Регистрация</title>
        </Helmet>
        <main className="auth">
            <h1 className="title-page">
                Регистрация учетной записи
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
                            : <div className="auth__inner transition" ref={transitionRef}>
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
                                <BtnAuth isValid={isValid} callback={() => setUpdateAlert(Date.now())}>
                                    Зарегистрироваться
                                </BtnAuth>
                            </form>
                            <OAuth/>
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
