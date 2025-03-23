import { useRef } from "react"
import { CSSTransition } from "react-transition-group"

import "./style/loader.sass"


export function Loader({isLoading, loaderMsg=null}){
    const loaderRef = useRef()

    return(
        <CSSTransition classNames="loader" nodeRef={loaderRef} in={isLoading} timeout={400}>
            <div className="loader" ref={loaderRef}>
                <svg className="loader-svg">
                    <use xlinkHref="/public/main.svg#loader-svg"/>    
                </svg>
                <p className="loader-text" >
                    {loaderMsg}
                </p>
            </div>    
        </CSSTransition>
    )
}