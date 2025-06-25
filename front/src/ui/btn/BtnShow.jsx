import { memo } from "react"

import "./style/btn_show.sass"


export const BtnShow = memo(({isActive, setIsActive}) => {
    return(
        <button className="btn-show" onClick={() => setIsActive(s => !s)}>
            <svg>
                {isActive
                    ? <use xlinkHref="/main.svg#arrow-up-svg"/>
                    : <use xlinkHref="/main.svg#arrow-down-svg"/>
                }
            </svg>
        </button>
    )
})

