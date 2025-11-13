import { memo } from "react"


export const InputMain = memo(({callbackOnChange, ...props}) => {
    return(
        <input 
            className="main-input" 
            onChange={(e) => callbackOnChange(e)}
            {...props}
        />
    )
})
