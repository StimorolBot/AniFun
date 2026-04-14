import { memo } from "react"

import { InputDefault } from "../../../../ui/input/InputDefault"


export const InputEpisode = memo(({
    id, 
    errorMsg,
    register,
    param="total_episode",
    placeholder="Количество эпизодов",
    ...props
}) => {
    return(
        <InputDefault
            id={id}
            type="number"
            placeholder={placeholder}
            min={1}
            max={1000}
            {...props}
            errorMsg={errorMsg}
            register={register(param, {
                "valueAsNumber": true,
                "min": {"value": 1, "message": "От 1"},
                "max": {"value": 1000, "message": "До 1000"}
            })}
        />
    )
})

