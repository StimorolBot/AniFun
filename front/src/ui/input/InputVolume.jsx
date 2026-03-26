import { memo } from "react"

import "./style/input_volume.sass"


export const InputVolume = memo(({ref, volume, setVolume}) => {
    const clampedVolume = Math.min(1, Math.max(0, Number(volume) || 0))
    
    const handleVolumeChange = (event) => {
        const nextVolume = Number(event.target.value)
        setVolume(nextVolume)
        ref.current.volume = nextVolume
    }

    return(
        <div className="input-volume__container">
            <input
                className="input-volume"  
                id="input-volume"
                type="range" 
                min={0} 
                max={1}
                step={0.1}
                onChange={handleVolumeChange}
                value={clampedVolume}
            />
            <div className="input-volume__background"/>
            <div
                className="input-volume__progress"
                style={{ width: `${clampedVolume * 100}%`}}
            />
            <div
                className="input-volume__thumb"
                style={{ left: `clamp(5px, ${clampedVolume * 100}%, calc(100% - 5px))`}}
            />
        </div>
    )
})