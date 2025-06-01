import { memo } from "react"

import "./style/btn_search.sass"


export const BtnSearch = memo(({setVal}) => {
   
    return(
        <button className="btn-search" title="Поиск" onClick={
            (e) => {
                document.body.classList.add("scroll_block")
                setVal(true)
                e.stopPropagation()
                }
            }>
            <svg className="search-svg">
                <use xlinkHref="/main.svg#search-svg"/>
            </svg>
        </button>
    )
})
