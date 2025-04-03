import { InputMain } from "./InputMain"


export function InputToken({register, errors, clickRef, watch, labelTitle="Токен"}){
    
    return(
        <InputMain labelTitle={labelTitle} id={"email_token"} type={"text"} ref={clickRef} 
            minLength={6} maxLength={6} watch={watch}
            register={ register("email_token", {
                required: true,
                minLength: {value: 6, message: "Длинна поля должна быть 6 символов"},
                maxLength: {value: 6, message: "Длинна поля должна быть 6 символов"},
                pattern: {value: /^[a-zA-Z0-9_\-]+$/, message: "Неверный формат токена"}
            })}
            errorMsg={errors?.email_token?.message}
        >
            <svg className="auth__svg">
                <use xlinkHref="/public/main.svg#token-svg"/>
            </svg>
        </InputMain>
    )
}
