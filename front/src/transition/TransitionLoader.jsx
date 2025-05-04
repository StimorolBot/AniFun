import { CSSTransition } from "react-transition-group"
import { Loader } from "../components/loader/Loader"

import "./style/transition_loader.sass"


export const TransitionLoader = ({transitionRef, isLoading, children}) => {
    
    return(
        <>
            <Loader isLoading={isLoading}/>    
            <CSSTransition 
                classNames="transition-loader"
                nodeRef={transitionRef} 
                in={!isLoading} 
                timeout={300}
                mountOnEnter unmountOnExit
            >
                {children}
            </CSSTransition>
        </>
    )
}