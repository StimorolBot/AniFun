import { memo } from "react"

import "./style/btn_auth.sass"


export const BtnAuth = memo(({isValid, callback, children, ...props}) => {
    return(
        <button 
            className="btn__auth"
            disabled={!isValid}
            onClick={callback}
            {...props}
        >
            { children }
        </button>
    )
})
