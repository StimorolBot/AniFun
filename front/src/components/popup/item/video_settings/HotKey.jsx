import { memo } from "react"
import { BtnDefault } from "../../../../ui/btn/BtnDefault"

import "./style/hotkey.sass"


export const HotKey = memo(({setSelectSettingsItem}) => {
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
            <ul className="hotkey__list">
                <li className="hotkey__item">
                    <span>
                        Воспроизведение/Пауза
                    </span>
                    <span className="settings__item-select">
                        Space
                    </span>
                </li>
                <li className="hotkey__item">
                    <span>
                        Вперед на 15 секунд
                    </span>
                    <span className="settings__item-select">
                        →
                    </span>
                </li>
                <li className="hotkey__item">
                    <span>
                        Назад на 15 секунд
                    </span>
                    <span className="settings__item-select">
                        ←
                    </span>
                </li>
                <li className="hotkey__item">
                    <span>
                        Отключить звук
                    </span>
                    <span className="settings__item-select">
                        M
                    </span>
                </li>
                <li className="hotkey__item">
                    <span>
                        Полноэкранный режим
                    </span>
                    <span className="settings__item-select">
                        F
                    </span>
                </li>
                <li className="hotkey__item">
                    <span>
                        Картинка в картинке 
                    </span>
                    <span className="settings__item-select">
                        P
                    </span>
                </li>
            </ul>
        </nav>
    )
})
