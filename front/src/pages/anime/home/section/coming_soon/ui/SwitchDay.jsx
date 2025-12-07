import "./style/switch_day.sass"


export function SwitchDay({value, setValue}){
    return(
        <ul className="switch-container">
            <li className={value === "today" ? "switch switch_active" : "switch"}
                onClick={() => setValue("today")}
            >
                Сегодня
            </li>
            <li className={value === "tomorrow" ? "switch switch_active" : "switch"}
                onClick={() => setValue("tomorrow")}
            >
                Завтра
            </li>
        </ul>
    )
}