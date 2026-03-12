import { useEffect, useRef } from "react"

import "./style/textarea_default.sass"


export function TextareaDefault({id, placeholder, value, setValue, ref, countLineBreak=4, ...props}){
    const textAreaRef = useRef(null)

    const changeValue = (value) => {
        if (value.split("\n").length > countLineBreak)
            return         
        setValue(value)
    }

    useEffect(() => {
        textAreaRef.current.style.height = "20px"
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }, [value])

    return(
        <div className="textarea-default__inner" ref={ref}>
            <textarea
                className="textarea-default"
                id={id}
                placeholder={placeholder}
                value={value}
                ref={textAreaRef}
                onChange={(event) => changeValue(event.target.value)}
                {...props}
            />
            <label htmlFor={id}/>
        </div>
    )
}