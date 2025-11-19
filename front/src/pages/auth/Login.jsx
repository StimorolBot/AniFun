import { Helmet } from "react-helmet"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../api"
import { cookies } from "../../cookie"
import { useFetch } from "../../hook/useFetch"

import { InputEmail } from "../../ui/input/InputEmail"
import { InputPassword } from "../../ui/input/InputPassword"
import { BtnAuth } from "../../ui/btn/BtnAuth"

import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthWarning } from "../../components/auth/AuthWarning"
import { Loader } from "../../components/loader/Loader"
import { AlertResponse } from "../../ui/alert/AlertResponse"
import { OAuth } from "../../components/auth/OAuth"


export function Login(){    
    const navigate = useNavigate()
    const transitionRef = useRef(null)
    const clickRef = useRef(false)
    const [updateAlert, setUpdateAlert] = useState()
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({
        mode: "onChange",
        defaultValues:{
            "identifier": "",
            "password": ""
        }
    })
        
    const [request, isLoading, error] = useFetch(
        async (data) => {
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

    return(<>
        <Helmet>
            <title>Авторизация</title>
        </Helmet>
        <main className="auth">
            <AuthBg/>
            <h1 className="title-page">
                Вход в учетную запись
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
                        ?<Loader/>
                        :<div className="auth__inner transition" ref={transitionRef}>
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
                                <BtnAuth isValid={isValid} callback={() => setUpdateAlert(Date.now())}>
                                    Авторизация
                                </BtnAuth>
                            </form>
                            <OAuth/>
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
