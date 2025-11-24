import { memo } from "react"

import "./style/loader.sass"


export const Loader = memo(({size="default"}) => {
    return(
        <span className="loader transition" data-size-loader={size}/>
    )
})
