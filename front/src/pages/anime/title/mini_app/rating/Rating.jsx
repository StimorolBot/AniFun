import { memo, useRef } from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../../../api"

import { RatingItem } from "./item/rating_item/RatingItem"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"

export const Rating = memo(({title}) => {
    const transitionRef = useRef(null)
    const queryClient = useQueryClient()
    
    const {data: ratingData, isLoading} = useQuery({
        queryKey: ["rating-data"],
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return await api.get("/anime/rating/", {params: {"title": title, "is_raise_exception": false}}).then(r => r.data) 
        }
    })

    const callback = async (currentRating) => {
        if (ratingData?.my_rating == currentRating)
            return await api.delete(
                "/anime/rating/delete-rating", 
                {data: {"star": currentRating, "title": title}}
            ).then(r => r.data)
        else if ((ratingData?.my_rating === 0) || (ratingData?.my_rating === undefined))
            return await api.post(
                "/anime/rating/set-rating", 
                {"star": currentRating, "title": title}
            ).then(r => r.data)
        else if (ratingData?.my_rating != currentRating)
            return await api.patch(
                "/anime/rating/update-rating",
                {"star": currentRating, "title": title}
            ).then(r => r.data)
    }

    const mutation = useMutation({
        mutationFn: callback,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["rating-data"]})
        }
    }) 

    return(
        <div className="rating">
            <SwitchTransition mode="out-in">
                <CSSTransition 
                    classNames="transition" 
                    key={isLoading}
                    nodeRef={transitionRef} 
                    timeout={300}
                >
                    { isLoading
                        ? <Loader size={"small"} />
                        : <div className="rating__container" ref={transitionRef}>  
                            <span className="rating__user">{ratingData?.avg || 0}/10</span>
                            <span className="rating__count">{ratingData?.total_count}</span>
                            <div className="rating-star__list">
                                <RatingItem 
                                    myRating={ratingData?.my_rating} 
                                    starsList={[10,9,8,7,6,5,4,3,2,1]}
                                    mutation={mutation}
                                />
                            </div>
                        </div>
                    }
                </CSSTransition>
            </SwitchTransition>    
        </div>
    )
})
