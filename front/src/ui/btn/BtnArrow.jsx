import { memo } from "react"

import "./style/btn_arrow.sass"


export const BtnArrow = memo(() =>{
    return(
        <button className="btn-arrow">
            <span className="btn-arrow__top"/>
            <span className="btn-arrow__bottom"/>
        </button>
    )
})