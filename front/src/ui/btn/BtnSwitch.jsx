import { memo, useRef } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import "./style/btn_switch.sass"


export const BtnSwitch = memo(({children, value,  callback}) => {
    const transitionRef = useRef()
    
    return(
        <SwitchTransition mode="out-in">
            <CSSTransition 
                classNames="transition" 
                key={value}
                nodeRef={transitionRef} 
                timeout={300}
            >
                <button className="btn-switch transition" type="reset" onClick={() => callback()} >
                    <svg ref={transitionRef}>
                        {children}
                    </svg>
                </button>
            </CSSTransition>
        </SwitchTransition>
    )
})
