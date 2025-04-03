import { useState } from "react"
import { ComingSoonItem } from "../ui/cards/ComingSoonItem"

import "./style/coming_soon.sass"



export function ComingSoon(){
    const [isToday, setIsToday] = useState(true)
    
    
    return(
        <section className="coming-soon">
            <div className="container">
                <header className="coming-soon__header">
                    <h2 className="section__title"> 
                        Расписание релизов
                    </h2>
                    <div className="coming-soon__switch-container">
                        <div className={isToday ? "coming-soon__switch coming-soon__switch_active" : "coming-soon__switch"}
                            onClick={() => setIsToday(true)}
                        >
                            Сегодня
                        </div>
                        <div className={isToday ? "coming-soon__switch" : "coming-soon__switch coming-soon__switch_active"}
                            onClick={() => setIsToday(false)}
                        >
                            Завтра
                        </div>
                    </div>
                </header>
                <ul className="coming-soon__list">
                    <ComingSoonItem/>
                    <ComingSoonItem/>
                    <ComingSoonItem/>
                    <ComingSoonItem/>
                    <ComingSoonItem/>
                    <ComingSoonItem/>
                    <ComingSoonItem/>                
                </ul>
            </div>
        </section>
    )
}