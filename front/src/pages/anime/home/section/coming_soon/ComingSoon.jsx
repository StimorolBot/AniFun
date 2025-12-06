import { useEffect, useRef, useState } from "react"
import Masonry from "react-masonry-css"

import { api } from "../../../../../api"
import { useFetch } from "../../../../../hook/useFetch"

import { WrapperSection } from "../../../wrapper/WrapperSection"
import { ComingSoonItem } from "./item/ComingSoonItem"

import { SwitchDay } from "./ui/SwitchDay"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export const ComingSoon = () => {
    const transitionRef = useRef()
    const [schedule, setSchedule] = useState("today")
    const [response, setResponse] = useState([{
        "episode_number": null,
        "title": null,
        "poster": null,
        "age_restrict": null,
        "genres": [""],
        "season": null,
        "year": null,
        "alias": null,
        "type": null
    }])

    const [request, isLoading, _] = useFetch(
          async () => {
            await api.get("/schedules", {params: {"schedule":schedule}}).then((r) => setResponse(r.data))
          }
        )

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [schedule])

    const breakpoints = {
        default: 4,
        1280: 3,
        880: 2,
        590: 1
    }

    return(
        <section className="coming-soon">
            <div className="container">
                <WrapperSection title={"Расписание релизов"} link={"/anime/schedules"} ref={transitionRef} value={isLoading}>
                    <>
                        <div className="switch-day__wrapper">
                            <SwitchDay value={schedule} setValue={setSchedule}/> 
                        </div>
                        <div className="container-coming-soon transition" ref={transitionRef}>
                            { isLoading
                                ? <Loader/>
                                : response[0]?.alias
                                    ? <Masonry breakpointCols={breakpoints} className="masonry" columnClassName="masonry__column">
                                        {response?.map((item, index) => {
                                            return <ComingSoonItem item={item} key={index}/>
                                        })}
                                    </Masonry>
                                    :<p className="coming-soon__empty">
                                        К сожалению, в ближайшее время новых серий не ожидается :( 
                                    </p>
                            }
                        </div>
                    </>                
                </WrapperSection>        
            </div>
        </section>
    )
}
