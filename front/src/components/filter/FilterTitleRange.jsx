import { memo } from "react"
import RangeSlider from 'react-range-slider-input'

import "react-range-slider-input/dist/style.css"
import "./style/double_input.sass"


export const FilterTitleRange = memo(({year, setYear}) => {

    return(
        <div className="double-input__container">
            <label htmlFor="double-input">{year[0] ? year[0] : 1980}</label>
            <RangeSlider
                className="double-input"
                id="double-input"
                min={1970} max={2050} step={1} 
                defaultValue={[1980, 2000]} 
                onInput={e => setYear(s => ({...s, "year": e})) } 
            />
            <label htmlFor="double-input">{year[1] ? year[1] : 2000}</label>
        </div>
    )
})
