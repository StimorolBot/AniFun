import { memo, useRef, useEffect, useState } from "react"
import { CSSTransition } from "react-transition-group"

import "./style/error.sass"


export const Error = memo(({error, resetForm}) => {
    const errorRef = useRef(null)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (Boolean(error?.response?.data.detail)){
            setIsError(true)
            resetForm()
        }
        
        const timer = setTimeout(() => setIsError(false), 1800)    
        return () => {
            clearTimeout(timer)
        }
    }, [error])

    return(
        <CSSTransition 
            classNames="error-popup"
            nodeRef={errorRef} 
            in={isError} 
            timeout={1800} 
            mountOnEnter unmountOnExit
        >
            <div className="error-popup" ref={errorRef}>
                <div className="error-popup__info">
                    <p className="error-popup__status-code">
                        <span>Ошибка №</span> {error?.response?.status}
                    </p>
                    <p className="error-popup__detail">
                        {error?.response?.data.detail}
                    </p>
                </div>
                <span className="error-popup__progress"></span>
                <svg className="error-popup-svg" onClick={() => setIsError(false)}>
                    <use xlinkHref="/public/main.svg#close-svg"/>    
                </svg>
            </div>
      </CSSTransition>
    )
})
