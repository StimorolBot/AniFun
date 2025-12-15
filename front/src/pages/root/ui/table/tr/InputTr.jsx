import { memo } from "react"

import { InputMain } from "../../input/InputMain"
import { InputNumber } from "../../input/InputNumber"
import { InputRadio } from "../../../../../ui/input/InputRadio"
import { InputDragAndDrop } from "../../input/InputDragAndDrop"
import { CustomSelect } from "../../../../../ui/input/CustomSelect"

import "./style/input_tr.sass"


export const InputTr = memo(({i, payload, setPayload, payloadFile, onChange, setPayloadFile}) => {
    
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
                            <InputNumber
                                min={i.valid_params?.min}
                                max={i.valid_params?.max}
                                required={i.valid_params?.is_required}
                                value={payload?.[i?.param_name] || ""}
                                callbackOnChange={e => onChange(e)}
                                name={i.param_name}
                                setPayload={setPayload}
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
                            <InputDragAndDrop 
                                id={`${i.valid_params.id}`}
                                required={i.valid_params?.is_required}
                                accept={i.valid_params.accept}
                                setPayloadFile={setPayloadFile}
                                paramName={i.param_name}
                                file={payloadFile}
                            />
                        )
                        case "radio": return(
                            <InputRadio
                                itemList={i.valid_value}
                                name={"is_origin"}
                                required={i.valid_params?.is_required}
                                callbackOnChange={e => onChange(e)}
                            />
                        )
                    }
                })()}
            </th>
        </tr>
    )
})
