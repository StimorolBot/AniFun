import { useForm } from "react-hook-form"
import { AuthBg } from "../../components/auth/AuthBg"
import { AuthTitle } from "../../components/auth/AuthTitle"
import { Loader } from "../../components/ui/loader/Loader"


export function ResetPasswordToken(){
    const {register, handleSubmit, watch, formState: {errors, isValid}, resetField} = useForm({mode: "onChange"})
    
    return(
        <main className="auth">
            <AuthBg/>
            <div className="auth__container">
                <Loader isLoading={isLoading} loaderMsg={<>Пожалуйста, подождите. <br />Идет проверка данных</>}/>
                <CSSTransition classNames="auth__inner" nodeRef={loadingRef} in={isLoading} timeout={400}>
                    <div className="auth__inner" ref={loadingRef}>
                        <AuthTitle title={"Восстановление пароля"} 
                            desc={<>
                                Вы можете восстановить забытый пароль и сгенировать новый.
                                <br/>
                                Введите Вашу почту, на которую вы зарегистрировали аккаунт, мы пришлем Вам письмо с дальнейшими инструкциями
                            </>}
                        />
                        <form className="auth__form" ref={clickRef} onSubmit={handleSubmit(request)}>
                            <InputEmail register={register} errors={errors} clickRef={clickRef} watch={watch}/>
                            <BtnAuth text={"Восстановить пароль"} isValid={isValid}/>
                        </form>
                        <AuthSocial/>
                        <ul className="auth__link-list">
                            <li>
                                <Link className="auth__link" to={"/auth/register"}>
                                    У меня уже есть токен
                                </Link>
                            </li>
                        </ul>
                        <AuthWarning/>
                    </div>
                </CSSTransition>            
            </div>
        </main>
    )
}