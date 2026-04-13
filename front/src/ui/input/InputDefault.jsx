import { memo } from "react"

import "./style/input_default.sass"


export const InputDefault = memo(({id, register, errorMsg, ...props}) => {
    return(
        <div className="input-default__container">
            <input className="input-default" id={id} {...register} {...props} />
            <label htmlFor={id}/>
            <span className="input-default__error">
                {errorMsg}
            </span>
        </div>
    )
})