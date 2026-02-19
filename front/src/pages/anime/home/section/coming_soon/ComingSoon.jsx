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
    const [urlIMg, setUrlIMg] = useState()
    const [schedule, setSchedule] = useState("today")
    const [response, setResponse] = useState([])

    const [request, isLoading, _] = useFetch(
        async () => {
            await api.get("/schedules", {params: {"schedule":schedule}}).then((r) => setResponse(r.data))
        }
    )

    const [getUrlImg, isLoadingImg, errorImg] = useFetch(
        async (url) => {
        await api.get(url).then(r => setUrlIMg(r.data))  
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
                                : response.length >= 1 
                                    ? <Masonry breakpointCols={breakpoints} className="masonry" columnClassName="masonry__column">
                                        {response?.map((item, index) => {
                                            return <ComingSoonItem item={item} getUrlImg={getUrlImg} urlIMg={urlIMg} schedule={schedule} key={index}/>
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
