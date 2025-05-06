import { useEffect, useState } from "react"
import Masonry from "react-masonry-css"

import { api } from "../api"
import { useFetch } from "../hook/useFetch"

import { HeaderSection } from "../components/header/HeaderSection"
import { ComingSoonItem } from "../components/cards/ComingSoonItem"

import { SwitchDay } from "../ui/switch/SwitchDay"
import { Loader } from "../components/loader/Loader"

import "./style/coming_soon.sass"


export function ComingSoon(){
    const [schedule, setSchedule] = useState("today")
    const [response, setResponse] = useState([{
        "schedule_data": {
            "episode_number": null,
            "title": null
        },
        "poster": null,
        "age_restrict": null,
        "genres": [""],
        "season": null,
        "year": null,
        "alias": null
    }])

    const [request, isLoading, error] = useFetch(
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
                <HeaderSection
                    title={"Расписание релизов"} link={"/anime/schedule"} 
                    description={"Сейчас мы трудимся над следующими тайтлами"}
                >
                    <SwitchDay value={schedule} setValue={setSchedule}/>                    
                </HeaderSection>
                { isLoading
                    ? <Loader isLoading={isLoading}/>
                    : <Masonry breakpointCols={breakpoints} className="masonry" columnClassName="masonry__column">
                        {response?.map((item, index) => {
                            return(
                                <ComingSoonItem item={item} key={index}/>
                            )
                        })}
                    </Masonry>
                }
            </div>
        </section>
    )
}
