import { memo } from "react"
import { BtnShow } from "../../ui/btn/BtnShow"

import "./style/header_route_ra.sass"


export const HeaderRouteRa = memo(({method, title, isActive, setIsActive}) => {
    return(
        <div className="ra__header">
            <p className={`ra__method ra__method_${method}`}>
                {method}
            </p>
            <p className="ra__title">
                {title}
            </p>
            <BtnShow isActive={isActive} setIsActive={setIsActive}/>
        </div>
    )
})