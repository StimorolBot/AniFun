import { InputMain } from "./InputMain"

export function InputName({register, errors, clickRef, watch}){
    
    return(
        <InputMain labelTitle={"Имя"} id={"user_name"} type={"text"} ref={clickRef}
            minLength={4} maxLength={32} watch={watch}
            register={ register("user_name", {
                required: true,
                minLength: {value: 4, message: "Длинна поля должна быть от 8 символов"},
                maxLength: {value: 32, message: "Длинна поля должна быть до 32 символов"},
                pattern: {value: /^[a-zA-Z0-9_\-]+$/, message: "Неверный формат имени"}
            })}
            errorMsg={errors?.user_name?.message}
        >
            <svg className="auth__svg">
                <use xlinkHref="/public/main.svg#login-svg"/>
            </svg>
        </InputMain>
    )
}
