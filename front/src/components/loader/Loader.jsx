import { memo } from "react"

import "./style/loader.sass"


export const Loader = memo(({size="default", center=false}) => {
    return(
        <span className="loader transition" data-size-loader={size} data-center={center}/>
    )
})
