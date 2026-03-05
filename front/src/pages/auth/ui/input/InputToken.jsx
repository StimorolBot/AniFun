import { InputMainAuth } from "./InputMainAuth"


export function InputToken({register, errors, clickRef, watch, id, labelTitle="Токен"}){
    
    return(
        <InputMainAuth labelTitle={labelTitle} id={id} type={"text"} ref={clickRef}
            minLength={8} maxLength={8} watch={watch}
            register={ register(id, {
                required: true,
                minLength: {value: 8, message: "Длинна поля должна быть 8 символов"},
                maxLength: {value: 8, message: "Длинна поля должна быть 8 символов"},
            })}
            errorMsg={errors?.[id]?.message}
        >
            <svg className="auth__svg">
                <use xlinkHref="/public/svg/auth.svg#token-svg"/>
            </svg>
        </InputMainAuth>
    )
}
