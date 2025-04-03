import { memo, useEffect, useRef } from "react"

import "./style/error.sass"


export const Error = memo(({errorData, setErrorData}) => {

    useEffect(() => {
        const timer = setTimeout(() => setErrorData({...errorData, is_hidden: true}), 5000)    
        return () => {
            clearTimeout(timer)
        }
    },[errorData.is_hidden])

    return(
        <div className={errorData.is_hidden ? "error-popup" : "error-popup   error-popup_active"}>
            <div className="error-popup__container">
                <div className="error-popup__detail">
                    <p className="error-popup__title">
                        Ошибка {errorData.status_code}
                    </p>
                    <p className="error-popup__decs">
                        {errorData.detail}
                    </p>
                </div>
            </div>
            <svg className="error-popup-svg" onClick={() => setErrorData({...errorData, is_hidden: true})}>
                <use xlinkHref="/public/main.svg#close-svg"/>    
            </svg>
            <process className={
                errorData.is_hidden ? "error-popup__progress" : "error-popup__progress  error-popup__progress_active"
            }/>
      </div>
    )

})