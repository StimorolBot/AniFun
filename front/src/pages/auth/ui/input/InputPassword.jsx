import { InputMainAuth } from "./InputMainAuth"


export function InputPassword({register, errors, clickRef, watch, id="password", labelTitle="Пароль"}){    
    return(
        <InputMainAuth 
            labelTitle={labelTitle} 
            id={id} 
            type={"password"} 
            ref={clickRef}
            minLength={8} 
            maxLength={32} 
            watch={watch} 
            register={ register(id, {
                required: true,
                minLength: {value: 8, message: "Поле должно быть от 8 символов"},
                maxLength: {value: 32, message: "Поле должна быть до 32 символов"},
            })}
            errorMsg={errors?.[id]?.message}
        >
            <svg className="auth__svg">
                {
                    id === "password"
                    ? <use xlinkHref="/public/svg/auth.svg#key_v3-svg"/>
                    : <use xlinkHref="/public/svg/auth.svg#key-svg"/>
                }
            </svg>
        </InputMainAuth>
    )
}
