import { InputMainAuth } from "./InputMainAuth"


export function InputToken({register, errors, clickRef, watch, labelTitle="Токен"}){
    
    return(
        <InputMainAuth labelTitle={labelTitle} id={"email_token"} type={"text"} ref={clickRef}
            minLength={8} maxLength={8} watch={watch}
            register={ register("email_token", {
                required: true,
                minLength: {value: 8, message: "Длинна поля должна быть 8 символов"},
                maxLength: {value: 8, message: "Длинна поля должна быть 8 символов"},
            })}
            errorMsg={errors?.email_token?.message}
        >
            <svg className="auth__svg">
                <use xlinkHref="/public/main.svg#token-svg"/>
            </svg>
        </InputMainAuth>
    )
}
