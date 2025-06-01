import { memo } from "react"

import "./style/loader.sass"


export const Loader = memo(() => {
    return(
        <span className="loader transition" />
    )
})
