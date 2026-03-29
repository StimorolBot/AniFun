import { memo } from "react"

import "./style/input_checkbox.sass"


export const InputCheckbox = memo(({id, callback, ...props}) => {
    return(
        <div className="input-checkbox__container">
            <input className="input-checkbox" id={id} type="checkbox" onChange={(e) => callback(e)} {...props}/>
            <label className="input-checkbox__label" htmlFor={id}/>
        </div>
    )  
})