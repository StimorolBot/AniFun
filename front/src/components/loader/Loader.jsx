import { memo } from "react"
import { useRef } from "react"
import { CSSTransition } from "react-transition-group"

import "./style/loader.sass"


export const Loader = memo(({isLoading}) => {
    const loaderRef = useRef()

    return(
        <CSSTransition classNames="loader" nodeRef={loaderRef} in={isLoading} timeout={300} mountOnEnter unmountOnExit>
            <span className="loader" ref={loaderRef}/>
        </CSSTransition>
    )
})
