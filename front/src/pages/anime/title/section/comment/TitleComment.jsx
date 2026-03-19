import { memo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "../../../../../api"
import { useObserver } from "../../../../../hook/useObserver"

import { TitleCommentItem } from "./item/TitleCommentItem"

import { Loader } from "../../../../../components/loader/Loader"
import { BtnDefault } from "../../../../../ui/btn/BtnDefault"
import { TextareaDefault } from "../../../../../ui/input/TextareaDefault"

import "./style.sass"


export const TitleComment = memo(({currentSlide, title, alias}) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const anchorRef = useRef()
    const lastElementRef = useRef()
    const transitionRef = useRef()

    const [comment, setComment] = useState("")
    const [responseComment, setResponseComment] = useState({})


    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
        queryKey: ["comment-data", alias],
        staleTime: 1000 * 60 * 3,
        enabled: currentSlide.section === "comments" ? true : false,
        queryFn: async (pageParam) => {
            return await api.get(`anime/comments/${title}`, {"params": {"size": 20, "page": pageParam.pageParam, "title": title}}).then(r => r.data)
        },
        getNextPageParam: (lastPage) => {
            return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined
        } 
    })
    
    const items = data?.pages?.flatMap(page => page.items) ?? []

    const callback = async (event) => {
        event.preventDefault()
        await api.post("anime/comments/create", 
            {
                "title": title, 
                "content": comment,
                "response_comment_uuid": responseComment?.responseCommentUuid,
                "response_author_uuid": responseComment?.responseAuthorUuid
            }
        )
        setResponseComment({})
        setComment("")
    }

    const mutation = useMutation({
        mutationFn: callback,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["comment-data", alias]})
        },
        onError: (e) => {
            console.log(e)
        }
    })

    const mutationLoadComment = useMutation({
        mutationFn: async ({event, commentUuid}) => {
            event.preventDefault()
            return await api.get(
                `anime/comments/response/${commentUuid}`,
                {"params": 
                    { "comment_uuid": commentUuid, "title": title, "is_raise_exception": false}
                }).then(r => r.data)
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["comment-data", alias], oldData => {
                if (!oldData) 
                    return oldData
                
                if (items[variables.index].uuid === variables.commentUuid)
                    items[variables.index]["response_comment"] = data.items
                return oldData
            })
        }
    })

    useObserver(lastElementRef, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage)

    return(
        <section className="title-release__section" style={{"marginLeft": currentSlide.marginLeft}}>
            <form className="title-release__form-comment" onSubmit={(e) => mutation.mutate(e)}>
                <div className="title-release__response-comment">
                    {responseComment.content && <> 
                        <p>{`↪ ${responseComment.content}`}</p>
                        <BtnDefault callback={() => setResponseComment({})}>
                            ⛌
                        </BtnDefault>
                    </>}
                </div>
                <TextareaDefault
                    value={comment} 
                    setValue={setComment}
                    placeholder={"Введите комментарий"}
                    ref={anchorRef}
                    minLength={3}
                    maxLength={500}
                />
                <BtnDefault type="submit">
                    Оставить комментарий
                </BtnDefault>
            </form>
            <SwitchTransition mode="out-in">
                <CSSTransition 
                    classNames="transition" 
                    key={isLoading}
                    nodeRef={transitionRef} 
                    timeout={300}
                >
                <ul 
                    className={items?.length > 0
                        ? "title-release__comment-list"
                        : "title-release__comment-list title-release__comment-list_empty"
                    }
                    ref={transitionRef}
                >
                    {items?.map((item, index) => {
                        return(
                            <TitleCommentItem
                                ref={anchorRef}
                                item={item}
                                level={1}
                                navigate={navigate}
                                maxLevel={25}
                                setResponseComment={setResponseComment}
                                mutation={mutationLoadComment}
                                index={index}
                                alias={alias}   
                                title={title}                    
                                key={index}
                            />
                        )
                    })}
                    {isLoading && <Loader/>}
                </ul>
                </CSSTransition>
            </SwitchTransition>
            <span className="last-element" ref={lastElementRef}/>
        </section>
    )
})
