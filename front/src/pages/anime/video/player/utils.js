export const setDataLocalStorage = (uuid, alias, currentTime, duration) => {
    if (!uuid || duration <= 0)
        return

    const progress =  Math.round((currentTime / duration) * 100)
    const localData = JSON.parse(localStorage.getItem(alias) || "{}")

    localData[uuid] = {
        "time": currentTime,
        "progress": progress,
        "is_watch": progress > 80 ? true : false,
    }

    localStorage.setItem(alias, JSON.stringify(localData))
}

export const formatTime = (timeInSeconds) => {
    const total = Math.max(0, Math.floor(timeInSeconds || 0))
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60

    const mm = String(minutes).padStart(2, "0")
    const ss = String(seconds).padStart(2, "0")

    if (hours > 0) {
        const hh = String(hours).padStart(2, "0")
        return `${hh}:${mm}:${ss}`
    }
    return `${mm}:${ss}`
}

export const handleTimeUpdate = (player, setCurrentProgress, setSeekProgress, setVideoDuration) => {
    const currentTime = player.currentTime() || 0
    const duration = player.duration() || 0

    if (duration > 0) {
        setCurrentProgress((currentTime / duration) * 100)
        setSeekProgress(currentTime)
        setVideoDuration(duration)
    }
}

export const handleProgress = (player, setBufferProgress) => {
    const duration = player.duration() || 0
    const buffered = player.buffered()
    
    if (duration > 0 && buffered.length > 0) {
        const currentTime = player.currentTime() || 0
        for (let i = buffered.length - 1; i >= 0; i--) {
            if (buffered.start(i) <= currentTime) {
                setBufferProgress((buffered.end(i) / duration) * 100)
                break
            }
        }
    }
}

export const handlerTogglePlay = (ref, alias, uuid, setIsPlaying) => { 
    if (ref.current?.paused){
        ref.current.play()
        setIsPlaying(true)
    }
    else {
        ref.current?.pause()
        setIsPlaying(false)
        setDataLocalStorage(uuid, alias, ref.current.currentTime, ref.current.duration)
    }
}

export const handleFullScreen = (containerRef) => {
    const el = containerRef?.current
    
    if (!el)
        return

    if (document.fullscreenElement === el)
        document.exitFullscreen()
    else
        el.requestFullscreen?.().catch(() => {})
}
