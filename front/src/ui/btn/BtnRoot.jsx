import { memo } from "react"

import "./style/btn_root.sass"


export const BtnRoot = memo(({prefix, children, clickCallback, ...props}) => {
    return(
        <button className={`btn-root ${prefix}`} {...props} onClick={clickCallback}>
            {children}
        </button>
    )
})