import { useEffect, useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "../../../api"
import { cookies } from "../../../cookie"

import { InputEmail } from "../ui/input/InputEmail"
import { InputPassword } from "../ui/input/InputPassword"
import { BtnAuth } from "../ui/btn/BtnAuth"

import { AuthBg } from "../components/AuthBg"
import { AuthTitle } from "../components/AuthTitle"
import { AuthWarning } from "../components/AuthWarning"
import { Loader } from "../../../components/loader/Loader"
import { AlertResponse } from "../../../ui/alert/AlertResponse"
import { OAuth } from "../components/OAuth"


export function Login(){    
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    
    const data = useRef()
    const clickRef = useRef(false)
    const transitionRef = useRef(null)
    
    const [updateAlert, setUpdateAlert] = useState()
    
    const {register, handleSubmit, watch, formState: {errors, isValid}, reset} = useForm({
        mode: "onChange",
        defaultValues:{
            "identifier": "",
            "password": ""
        }
    })

    const {loginData, refetch, isLoading, error} = useQuery({
        queryKey: ["login-data"],
        enabled: !!data.current,
        staleTime: 0,
        retry: () => {
            reset()
            queryClient.invalidateQueries({queryKey: ["login-data"]})
        },
        queryFn: async () => {
            const tokens = await api.patch("/auth/login", data.current).then((r) => r.data) 
            cookies.set(
                "access_token", tokens.access_token,
                {path: "/"}
            )
            cookies.set(
                "refresh_token", tokens.refresh_token,
                {path: "/"}
            )
            navigate("/")
        }
    })

    const onSubmit = (d) => {
        data.current  = d
        refetch()
    }
    
    useEffect(() => {
        document.addEventListener("keydown", e => e.stopImmediatePropagation())            
        return () => {
            document.removeEventListener("keydown", e => e.stopImmediatePropagation())
        }
    })
    
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
                            <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(onSubmit)}>
                                <InputEmail register={register} errors={errors} clickRef={clickRef} watch={watch} />
                                <InputPassword register={register} errors={errors} clickRef={clickRef} watch={watch} />
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
                    prefix={error?.response && "error"}
                />
            }
        </main>
    </>)
}
