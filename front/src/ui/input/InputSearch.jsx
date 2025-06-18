import { memo } from "react"

import "./style/input_search.sass"


export const InputSearch = memo(({setVal, val, ...props}) => {

    return(
        <input
            className="input-search" type="search" 
            onChange={(e) => setVal(e.target.value)}
            placeholder="Введите название аниме..."
            value={val}
            {...props}
        />
    )
})