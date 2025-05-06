import { memo } from "react"

import "./style/btn_auth.sass"


export const BtnAuth = memo(({text, isValid, ...props}) => {
    return(
        <button className="btn__auth" disabled={!isValid} {...props}>
            { text }
        </button>
    )
})
