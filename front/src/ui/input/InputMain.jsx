import { useState } from "react"
import { useClickOutside } from "../../hook/useClickOutside"

import "./style/input_main.sass"


export function InputMain({labelTitle, id, type, ref, register, watch, errorMsg="", children,  ...props}){
    const [isFocus, setIsFocus] = useState(false)  
    useClickOutside(ref, setIsFocus, watch(id))

    return(
        <div className={errorMsg ? "input-main__inner input-main__inner_error" : "input-main__inner"}>
            <label className={isFocus ? "input-main__label input-main__label_active" : "input-main__label"} htmlFor={id}>
                { labelTitle }
            </label>
            { children }
            <input className="input-main" id={id} type={type} onClick={() => setIsFocus(true)} {...register} {...props}/>
            <p className="input-main__error">
                { errorMsg }
            </p>
        </div>
    )
}
