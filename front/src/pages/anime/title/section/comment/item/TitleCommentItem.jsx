import { memo, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { api } from "../../../../../../api"
import { cookies } from "../../../../../../cookie"

import { convertDate } from "../../../../../../utils/utils"
import { BtnDefault } from "../../../../../../ui/btn/BtnDefault"
import { RatingComment } from "../../../mini_app/rating_comment/RatingComment"

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
    ...props
}) => {
    
    if (level > maxLevel)
        return null

    const [isShowCommentResponse, setIsShowCommentResponse] = useState(false)
    
    const clickOnAnchor = (uuid, authorUuid, content) => {
        if (!cookies.get("access_token")){
            return navigate("/auth/login")
        }

        setResponseComment({
            "uuid_comment": uuid, 
            "uuid_author": authorUuid,
            "content": content,
        })

        ref.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        })
    }
    
    const {data: imgData}  = useQuery({
        queryKey: ["comment-avatar", item.avatar_uuid],
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
                            <BtnDefault callback={() => clickOnAnchor(
                                item.uuid,
                                item.author_uuid, 
                                item.content
                            )}>
                                Ответить
                            </BtnDefault>    
                        </div>
                    </div>
                </div>
                <RatingComment/>
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
                            setResponseComment={setResponseComment}
                            index={""}
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
