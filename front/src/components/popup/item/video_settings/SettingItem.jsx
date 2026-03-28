import { memo } from "react"

import { BtnDefault } from "../../../../ui/btn/BtnDefault"


export const SettingItem = memo(({valueList, value, setSelectSettingsItem, callback, prefix}) => {
    return(
        <nav className="settings-video__nav">
            <div className="settings-video__btn">
                <BtnDefault callback={() => setSelectSettingsItem("nav")}>
                    <div className="btn-back-settings-video__container">
                        <svg>
                            <use xlinkHref="/svg/video.svg#btn-back-settings-video"/>
                        </svg>
                        <p>Назад</p>
                    </div>
                </BtnDefault>
            </div>        
            <ul className="settings__list">
                {valueList.map(item => {
                    return ( 
                        <li 
                            className={item === value ? "settings__item settings__item_active" : "settings__item"} 
                            key={item}
                            onClick={() => callback()}
                        >
                            {item}{prefix}
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
})
