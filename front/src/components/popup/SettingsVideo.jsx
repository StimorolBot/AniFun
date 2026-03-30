import { memo, useRef, useState } from "react"

import { useClickOutside } from "../../hook/useClickOutside"

import { Nav } from "./item/video_settings/Nav"
import { HotKey } from "./item/video_settings/HotKey"
import { SettingItem } from "./item/video_settings/SettingItem"

import "./style/settings_video.sass"


export const SettingsVideo = memo(({isOpen, setIsOpen, videoSettings, setVideoSettings}) => {
    const clickRef = useRef()
    const [selectSettingsItem, setSelectSettingsItem] = useState("main")
    
    const speedList = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    const qualityList = [480, 720, 1080]

    useClickOutside(clickRef, setIsOpen, "", isOpen, true)
   
    const selectSettingsMenu = () => {
        switch (selectSettingsItem){
            case "nav":
                return (
                    <Nav 
                        setIsOpen={setIsOpen} 
                        setSelectSettingsItem={setSelectSettingsItem} 
                        speed={videoSettings.speed}
                        quality={videoSettings.quality}
                        videoSettings={videoSettings}
                        setVideoSettings={setVideoSettings}
                    />
                ) 
            case "speed":
                return(
                    <SettingItem 
                        valueList={speedList}
                        value={videoSettings.speed}
                        setSelectSettingsItem={setSelectSettingsItem} 
                        callback={speed => setVideoSettings(s => ({...s, "speed": speed}))}
                        prefix={"x"}
                    /> 
                )
            case "quality":
                return (
                    <SettingItem 
                        valueList={qualityList}
                        value={videoSettings.quality}
                        setSelectSettingsItem={setSelectSettingsItem} 
                        callback={quality => setVideoSettings(s => ({...s, "quality": quality}))}
                        prefix={"p"}
                    />
                )
            case "hotKey":
                return <HotKey setSelectSettingsItem={setSelectSettingsItem}/> 
            default:
                return(
                    <Nav 
                        setIsOpen={setIsOpen}
                        setSelectSettingsItem={setSelectSettingsItem} 
                        speed={videoSettings.speed}
                        quality={videoSettings.quality}
                        videoSettings={videoSettings}
                        setVideoSettings={setVideoSettings}
                    />
                ) 
        }
    }

    return(
        <dialog className="settings-video" open={isOpen}>
            <div className="settings-video__background"/>
            <div className="settings-video__container" ref={clickRef}>
                {selectSettingsMenu()}
            </div>
        </dialog>
    )
})
