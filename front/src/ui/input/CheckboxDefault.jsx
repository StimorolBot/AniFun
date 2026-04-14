import { memo } from "react"

import "./style/checkbox_default.sass"


export const CheckboxDefault = memo(({id, children, value, callback, ...props}) => {
    return(
        <div className="checkbox-default__container">
            <input
                className="checkbox-default"
                id={id}
                checked={value}
                onChange={() => callback()}
                type="checkbox"
                {...props}
            />
            <label className="checkbox-default__label" htmlFor={id}>
                {children}
            </label>
        </div>
    )
})
