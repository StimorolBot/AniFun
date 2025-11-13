import { memo, useRef, useEffect, useState } from "react"
import { CSSTransition } from "react-transition-group"

import "./style/alert_response.sass"


export const AlertResponse = memo(({msg, statusCode, prefix, update, setResponse, timeout=6000}) => {
    const alertRef = useRef(null)
    const [isShowAlert, setIsShowAlert] = useState(false)

    useEffect(() => {
        if ((msg !== undefined) && (statusCode !== undefined)){
            setIsShowAlert(true)            
            const timer = setTimeout(() => setIsShowAlert(false), timeout)    
                return () => {
                    clearTimeout(timer)
                    setResponse()
            }
        } 
    }, [update])

    return(
        <CSSTransition 
            classNames="alert-response"
            nodeRef={alertRef} 
            in={isShowAlert} 
            timeout={timeout} 
            mountOnEnter 
            unmountOnExit
        >
            <div className="alert-response" ref={alertRef}>
                <div className={`alert-response__container alert-response__container_${prefix}`}>
                    <div className="alert-response__info">
                        <p className="alert-response__status-code">
                            <span>{statusCode}</span>
                        </p>
                        <p className="alert-response__detail">
                            {msg?.detail || msg}
                        </p>
                    </div>
                    <span className="alert-response__progress"/>
                    <svg className="alert-response-svg" onClick={() => setIsShowAlert(false)}>
                        <use xlinkHref="/public/main.svg#close-svg"/>    
                    </svg>
                </div>
            </div>
      </CSSTransition>
    )
})
