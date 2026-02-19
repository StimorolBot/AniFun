import { memo, useEffect, useRef, useState } from "react"

import { api } from "../../../../../api"
import { useFetch } from "../../../../../hook/useFetch"

import { EpisodeItem } from "./item/EpisodeItem"
import { WrapperSection } from "../../../wrapper/WrapperSection"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export const NewEpisodes= memo(() => {
  const transitionRef = useRef()
  const [urlIMg, setUrlIMg] = useState()
  const [response, setResponse] = useState([])

  const [request, isLoading, _] = useFetch(
    async () => {
      await api.get("/new-episode", {params: {"limit": 6}}).then((r) => setResponse(r.data))
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
  }, [])
  
  return(
    <section className="new-episodes">
      <div className="container">
        <WrapperSection title={"Новые эпизоды"} link={"anime/new-episode"} ref={transitionRef} value={isLoading}>
          <div className="container-new-episodes transition" ref={transitionRef}>
            { isLoading
              ? <Loader/>
              : <ul className="episode__list">
                {response?.map((item, index) => {
                  return <EpisodeItem item={item} getUrlImg={getUrlImg} urlIMg={urlIMg} index={index} key={index} />
                })}
              </ul>
            }
          </div>
        </WrapperSection>
      </div>
    </section>
  )
})
