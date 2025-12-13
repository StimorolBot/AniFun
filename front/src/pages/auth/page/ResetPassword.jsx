import { useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../.././../api"
import { useFetch } from "../../../hook/useFetch"

import { AuthBg } from "../components/AuthBg"
import { AuthTitle } from "../components/AuthTitle"
import { BtnAuth } from "../ui/btn/BtnAuth"

import { InputToken } from "../ui/input/InputToken"
import { InputPassword } from "../ui/input/InputPassword"
import { AlertResponse } from "../../../ui/alert/AlertResponse"
import { Loader } from "../../../components/loader/Loader"


export function ResetPassword(){
    const navigate = useNavigate()
    const [updateAlert, setUpdateAlert] = useState()
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

    return(<>
        <Helmet>
            <title>Сброс пароля</title>
        </Helmet>
        <main className="auth">
            <AuthBg/>
            <h1 className="title-page">
                Сброс пароля
            </h1>
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
                        : <div className="auth__inner transition-loader" ref={transitionRef}>
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
                                <BtnAuth isValid={isValid} callback={() => setUpdateAlert(Date.now())}>
                                    Сохранить новый пароль
                                </BtnAuth>
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
