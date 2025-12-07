import { memo } from "react"

import "./style/filter_title.sass"


export const FilterTitle = memo(({filterList, filterParams, setFilterParams, keyFilter}) => {

    const addFilterParams = (value) => {
        if (filterParams.includes(value))
            setFilterParams(s => ({...s, [keyFilter]: s[keyFilter].filter(p => p !== value)}))
        else
            setFilterParams(s => ({...s, [keyFilter]: [...s[keyFilter], value]}))       
    }

    return(
        <ul className="filter-title__list">
            {filterList?.map((item, index) => {
                return(
                    <li className="filter-title__item" key={index}>
                        <input
                            id={`filter-type-${item}`} 
                            type="checkbox" 
                            value={item} 
                            name="filter-title"
                            onClick={e => addFilterParams(e.target.value)}
                        />
                        <label htmlFor={`filter-type-${item}`}>
                            {item} 
                        </label>
                    </li>
                )
            })}
        </ul>
    )
})
