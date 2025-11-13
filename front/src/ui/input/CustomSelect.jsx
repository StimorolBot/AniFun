import Select from "react-select"

import "./style/custom_select.sass"


export function CustomSelect({value, setValue, options, className="custom-select",  paramName=undefined, ...props}){    
    
    const getValue = () => {
        if (value){
            if (paramName && props?.isMulti )
                return props?.isMulti 
                    ? options?.filter(v => value[paramName]?.indexOf(v.value) >= 0) 
                    : options?.find(v => v[paramName].value == value)
            else
                return props?.isMulti 
                    ? options.filter(v => value?.indexOf(v.value) >= 0) 
                    : options?.find(v => v.value == value)
        }
        else
            return props.isMulti ? [] : ""
    }

    const onChange = (newValue) =>{
        if (paramName)
            setValue(props?.isMulti ? s => ({...s, [paramName] : newValue.map(v => v.value)}) : s => ({...s, [paramName] : newValue.value}))
        else
            setValue(props?.isMulti ?  newValue.map(v => v.value) : newValue)
    }

    return(
        <Select
            className={className}
            classNamePrefix={className}
            value={getValue()} 
            onChange={onChange} 
            options={options}
            {...props}
        />
    )
}
