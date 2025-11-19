import { useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { BtnAuth } from "../../ui/btn/BtnAuth"
import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { AuthWarning } from "../../components/auth/AuthWarning"

import { InputEmail } from "../../ui/input/InputEmail"
import { AlertResponse } from "../../ui/alert/AlertResponse"
import { OAuth } from "../../components/auth/OAuth"
import { Loader } from "../../components/loader/Loader"


export function ResetPasswordToken(){
    const clickRef = useRef(null)
    const transitionRef = useRef(null)
    const navigate = useNavigate()
    const [updateAlert, setUpdateAlert] = useState()
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
        <>
        <Helmet>
            <title>Восстановление пароля</title>
        </Helmet>
        <main className="auth">
            <AuthBg/>
            <h1 className="title-page">
                Восстановление пароля
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
                                <BtnAuth isValid={isValid} callback={() => setUpdateAlert(Date.now())}>
                                    Восстановить пароль
                                </BtnAuth>
                            </form>
                            <OAuth/>                    
                            <ul className="auth__link-list">
                                <li>
                                    <Link className="auth__link" to={"/auth/reset-password"}>
                                        У меня уже есть токен
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
        </>
    )
}
