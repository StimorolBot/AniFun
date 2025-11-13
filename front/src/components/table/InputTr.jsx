import { memo } from "react"

import { InputMain } from "../../ui/input/InputMain"
import { CustomSelect } from "../../ui/input/CustomSelect"

import "./style/input_tr.sass"


export const InputTr = memo(({i, payload, setPayload, onChange, setPayloadFile}) => {

    return(
        <tr className="input-tr__item-container" data-required={i.valid_params?.is_required}>
            <th>
                <h4 className="input-tr__title">
                    {i?.transcription}
                </h4>
            </th>
            <th>
                {(() => {
                    switch (i?.type) {
                        case "str": return (
                            <InputMain
                                type="text"
                                value={payload?.[i?.param_name] || ""}
                                minLength={i.valid_params?.min_length}
                                maxLength={i.valid_params?.max_length}
                                required={i.valid_params?.is_required}
                                callbackOnChange={e => onChange(e)
                                }
                            />
                        )
                        case "int": return (
                            <InputMain 
                                type="number"
                                value={payload?.[i?.param_name] || ""}
                                min={i.valid_params?.min}
                                max={i.valid_params?.max}
                                required={i.valid_params?.is_required}
                                callbackOnChange={e => onChange(e)
                                }
                            /> 
                        )
                        case "date": return (
                            <InputMain 
                                type="date"
                                value={payload?.[i?.param_name] || ""}
                                required={i.valid_params?.is_required}
                                callbackOnChange={e => onChange(e)}
                            /> 
                        ) 
                        case "select_value": return (
                            <CustomSelect
                                options={i.valid_value}
                                value={payload}
                                setValue={setPayload}
                                isMulti={i?.is_multi}
                                required={i.valid_params?.is_required}
                                isSearchable={i?.is_searchable || false}
                                paramName={i.param_name}
                                placeholder={`Выберите ${i.transcription}`}
                                noOptionsMessage={() => "Не удалось найти"}
                            />
                        )
                        case "file": return (
                            <InputMain 
                                type="file"
                                required={i.valid_params?.is_required}
                                callbackOnChange={
                                    e => setPayloadFile(s => ({...s, [i.param_name]: e.target.files[0]})) 
                                }
                            />
                        )
                    }
                })()}
            </th>
        </tr>
    )
})
