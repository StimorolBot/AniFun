import { memo, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { api } from "../../../../../../api"
import { cookies } from "../../../../../../cookie"

import { convertDate } from "../../../../../../utils/utils"
import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"
import { ReactionComment } from "../../../mini_app/reaction/ReactionComment"
import { titleCommentUserAvatar } from "../../../../../../query_key"

import "./style.sass"


export const TitleCommentItem = memo(({
    ref, 
    item, 
    level, 
    navigate, 
    maxLevel,
    setResponseComment,
    mutation,
    index,
    alias,
    title,
    queryClient,
    ...props
}) => {
    if (level > maxLevel)
        return null

    const [isShowCommentResponse, setIsShowCommentResponse] = useState(false)
    
    const clickOnAnchor = (uuid, content, authorUuid) => {
        if (!cookies.get("access_token")){
            return navigate("/auth/login")
        }

        setResponseComment({
            "responseCommentUuid": uuid, 
            "content": content,
            "responseAuthorUuid": authorUuid
        })

        ref.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        })
    }
    
    const {data: imgData}  = useQuery({
        queryKey: [titleCommentUserAvatar, item.avatar_uuid],
        staleTime: 1000 * 60 * 3,
        queryFn: async () => {
            return await api.get(`/s3/user-${item.author_uuid}/${item.avatar_uuid}`).then(r => r.data)
        }
    })
        
    return(
        <li className="title-release__comment-item" key={item.uuid} {...props}>
            <div className="title-release__comment-inner">
                <div className="title-release__comment-container">
                    <Link className="title-release__comment-link" to={`/users/${item.author_uuid}`}>
                        <img className="title-release__img" src={imgData} alt="author-avatar"/>
                    </Link>
                    <div className="title-release__comment-item-content">
                        <div className="title-release__comment-wrapper">
                            <Link className="title-release__comment-link" to={`/users/${item.author_uuid}`}>
                                <h4 className="title-release__comment-author-name">
                                    {item.user_name}
                                </h4>
                            </Link>
                            <time dateTime={item.date_add}>
                                {convertDate(item.date_add)}
                            </time>
                        </div>
                        <div className="title-release__comment-text">
                            {item?.response_author_name &&
                                <Link to={`/users/${item.author_uuid}`}>
                                    @{item.response_author_name}
                                 </Link>
                            }
                            <span>{item.content}</span>
                        </div>
                        <div className="title-release__btn-container">
                            {level < maxLevel && 
                                <BtnDefault callback={() => clickOnAnchor(
                                    item.uuid,
                                    item.content,
                                    item.author_uuid
                                )}>
                                    Ответить
                                </BtnDefault>
                            }    
                        </div>
                    </div>
                </div>
                <ReactionComment
                    uuid={item.uuid} 
                    title={title}
                    likeCount={item.like_count}
                    dislikeCount={item.dislike_count}
                    myReaction={item.my_reaction}
                    queryClient={queryClient}
                    alias={alias}
                />
            </div>
            <ul 
                className={
                    item?.response_comment && isShowCommentResponse
                    ? "release__comment-response" 
                    : "release__comment-response release__comment-response_empty"
                }
            >
                {item?.response_comment?.map((i, index) => {
                    return(
                        <TitleCommentItem
                            ref={ref}
                            item={i}
                            level={level + 1}
                            navigate={navigate}
                            maxLevel={maxLevel}
                            title={title}
                            alias={alias}
                            setResponseComment={setResponseComment}
                            mutation={mutation}
                            index={index}
                            queryClient={queryClient}
                            key={index}
                        />
                    )})
                }
            </ul>
            {item.count_response >= 1 &&
                <div className="release__comment-btn-container">
                    <BtnDefault 
                        callback={(e) => {
                            setIsShowCommentResponse(s => {
                                if (!s === true)
                                    mutation.mutate({"event": e, "commentUuid":  item.uuid, "index": index})
                                return !s
                            })
                        }} 
                    >
                        {isShowCommentResponse 
                            ? `▲ Скрыть ответы (${item.count_response})`
                            : `▼ Показать ответы (${item.count_response})`
                        }
                    </BtnDefault>                                
                </div> 
            }
        </li>
    )
})
