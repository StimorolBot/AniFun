import { memo, useEffect, useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../../../api"
import { useFetch } from "../../../../../hook/useFetch"

import { RatingItem } from "./item/rating_item/RatingItem"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export const Rating = memo(({title}) => {
    const transitionRef = useRef(null)
    const [response, setResponse] = useState({
        "total_count": 0,
        "avg": 0,
        "my_rating": 0
    })

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(`/anime/rating/`, {params: {"title": title, "is_raise_exception": false}})
            .then((r) => {
                setResponse(r.data)
            })
        }
    )

    const [requestRating, isLoadingRating, errorRating] = useFetch(
        async (currentRating) => {
            if (response?.my_rating == currentRating)
                await api.delete(
                    "/anime/rating/delete-rating", 
                    {data: {"star": currentRating, "title": title}}
                ).then((r) => setResponse(r.data))
            else if ((response?.my_rating === 0) || (response?.my_rating === undefined))
                await api.post(
                    "/anime/rating/set-rating", 
                    {"star": currentRating, "title": title}
                ).then((r) => setResponse(r.data))
            else if (response?.my_rating != currentRating)
                await api.patch(
                    "/anime/rating/update-rating",
                    {"star": currentRating, "title": title}
                ).then((r) => setResponse(r.data))
            }
        )

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [title])

    return(
        <div className="rating">
            <SwitchTransition mode="out-in">
                <CSSTransition 
                    classNames="transition" 
                    key={isLoading}
                    nodeRef={transitionRef} 
                    timeout={300}
                >
                    { isLoading || isLoadingRating
                        ? <Loader size={"small"} />
                        : <div className="rating__container" ref={transitionRef}>  
                            <span className="rating__user">{response?.avg ? response.avg : 0}/10</span>
                            <span className="rating__count">{response?.total_count}</span>
                            <div className="rating-star__list">
                                <RatingItem 
                                    myRating={response?.my_rating} 
                                    starsList={[10,9,8,7,6,5,4,3,2,1]}
                                    requestRating={requestRating}
                                />
                            </div>
                        </div>
                    }
                </CSSTransition>
            </SwitchTransition>    
        </div>
    )
})
