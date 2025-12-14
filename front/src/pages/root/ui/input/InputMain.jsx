import { memo } from "react"

import "./style/input_main.sass"


export const InputMain = memo(({callbackOnChange, ...props}) => {
    return(
        <input 
            className="main-input" 
            onChange={(e) => callbackOnChange(e)}
            {...props}
        />
    )
})
