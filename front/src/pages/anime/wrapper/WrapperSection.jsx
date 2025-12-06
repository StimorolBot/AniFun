import { memo } from "react"
import { Link } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import "./style.sass"


export const WrapperSection = memo(({title, link, ref, children, value}) => {
    
    return(
        <div className="section__wrapper">
            <div className="section__inner">
                <Link className="section__link" to={link}>
                    <h2 className="section__title">
                        {title}
                    </h2>
                </Link>
            </div>
            <SwitchTransition mode="out-in">
                <CSSTransition 
                    classNames="transition" 
                    key={value}
                    nodeRef={ref} 
                    timeout={300}
                >
                    {children}
                </CSSTransition>
            </SwitchTransition>  
        </div>
    )
})
