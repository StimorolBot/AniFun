import { InputMain } from "./InputMain"


export function InputPassword({register, errors, clickRef, watch, id="password", labelTitle="Пароль"}){
    
    return(
        <InputMain labelTitle={labelTitle} id={id} type={"password"} ref={clickRef} 
            minLength={8} maxLength={32} watch={watch} 
            register={ register(id, {
                required: true,
                minLength: {value: 8, message: "Длинна поля должна быть от 8 символов"},
                maxLength: {value: 32, message: "Длинна поля должна быть до 32 символов"},
                pattern: {value: /^([A-Z]\w*)(\d*)$/, message: "Неверный формат пароля"}
            })}
            errorMsg={errors?.[id]?.message}
        >
            <svg className="auth__svg">
                {
                    id === "password"
                    ? <use xlinkHref="/public/main.svg#key_v3-svg"/>
                    : <use xlinkHref="/public/main.svg#key-svg"/>
                }
            </svg>
        </InputMain>
    )
}
