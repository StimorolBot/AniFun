import { memo, useEffect } from "react"

import { BtnDefault } from "../../../../ui/btn/BtnDefault"
import { InputCheckbox } from "../../../../ui/input/InputCheckbox"


export const Nav = memo(({
    setIsOpen, 
    setSelectSettingsItem, 
    speed, 
    quality, 
    videoSettings,
    setVideoSettings
}) => {
    useEffect(() => {
        localStorage.setItem("player_settings", JSON.stringify(videoSettings))
    }, [videoSettings])

    return(
        <nav className="settings-video__nav">
            <div className="settings-video__btn">
                <BtnDefault callback={() => setIsOpen(false)}>
                    <div className="btn-close-settings-video__container">
                        <svg>
                            <use xlinkHref="/svg/video.svg#btn-close-settings-video"/>
                        </svg>
                        <p>Закрыть</p>
                    </div>
                </BtnDefault>
            </div>        
            <ul className="settings__list">
                <li className="settings__item" onClick={() => setSelectSettingsItem("speed")}>
                    <span>
                        Скорость
                    </span>
                    <span className="settings__item-select">
                        {speed}x
                    </span>
                </li>
                <li className="settings__item" onClick={() => setSelectSettingsItem("quality")}>
                    <span>
                        Качество
                    </span>
                    <span className="settings__item-select">
                        {quality}p
                    </span>
                </li>
                <li className="settings__item" onClick={() => setSelectSettingsItem("hotKey")}>
                    Горячие клавиши
                </li>
                <li className="settings__item settings__item_title">
                    Управление опенингом/эндингом
                </li>
                <li className="settings__item">
                    <span>
                        Пропускать опенинг
                    </span>
                    <InputCheckbox
                        id={"skip-opening-input"}
                        checked={videoSettings.isSkipOpening}
                        callback={
                            (e) => setVideoSettings(s => ({...s, "isSkipOpening": e.target.checked}))
                        }
                    />
                </li>
                <li className="settings__item">
                    <span>
                        Пропускать эндинг
                    </span>
                    <InputCheckbox
                        id={"skip-ending-input"}
                        checked={videoSettings.isSkipEnding}
                        callback={
                            (e) => setVideoSettings(s => ({...s, "isSkipEnding": e.target.checked}))
                        }
                    />
                </li>
                <li className="settings__item settings__item_title">
                    Управление воспроизведением
                </li>
                <li className="settings__item">
                    <span>
                        Авто-воспроизведение
                    </span>
                    <InputCheckbox
                        id={"auto-play-input"}
                        checked={videoSettings.isAutoPlay}
                        callback={
                            (e) => setVideoSettings(s => ({...s, "isAutoPlay": e.target.checked}))
                        }
                    />
                </li>
                <li className="settings__item">
                    <span>
                        Авто-полноэкранный режим
                    </span>
                    <InputCheckbox
                        id={"auto-fullscreen-input"}
                        checked={videoSettings.isAutoFullScreen}
                        callback={
                            (e) => setVideoSettings(s => ({...s, "isAutoFullScreen": e.target.checked}))
                        }
                    />
                </li>
            </ul>
        </nav>
    )
})