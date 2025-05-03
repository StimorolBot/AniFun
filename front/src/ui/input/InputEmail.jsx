import { InputMain } from "./InputMain"


export function InputEmail({register, errors, clickRef, watch}){    
    return(
        <InputMain labelTitle={"Логин"} id={"identifier"} type={"email"} ref={clickRef} 
            minLength={4} maxLength={30} watch={watch}
            register={register("identifier", {
                required: true,
                minLength: {value: 4, message: "Длинна поля должна быть от 4 символов"},
                maxLength: {value: 30, message: "Длинна поля должна быть до 30 символов"},
                pattern: {value: /(^[a-zA-Z0-9_-]+@[a-z]+\.[a-z]+)/, message: "Неверный формат почты"}
            })} 
            errorMsg={errors?.identifier?.message}
        >
            <svg className="auth__svg">
                <use xlinkHref="/public/main.svg#login-svg"/>
            </svg>
        </InputMain>
    )
}
