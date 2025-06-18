import Select from "react-select"

import "./style/custom_select.sass"


export function CustomSelect({value, setValue, options, ...props}){    
    
    const getValue = () => {
        if (value){
            return props?.isMulti 
                ? options.filter(v => value.indexOf(v.value) >= 0) 
                : options.find(v => v.value == value)
        }
        else
            return props.isMulti ? [] : ""
    }

    const onChange = (newValue) => {
        setValue(props?.isMulti ?  newValue.map(v => v.value) : newValue)
    }

    return(
        <Select
            className="custom-select"
            classNamePrefix="custom-select"
            value={getValue()} 
            onChange={onChange} 
            options={options}
            {...props}
        />
    )
}
