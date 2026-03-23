import { memo } from "react"

import { useMutation } from "@tanstack/react-query"
import { api } from "../../../../../api"

import { BtnDefault } from "../../../../../ui/btn/BtnDefault"
import { updateReaction, updateCommentInItems } from "./utils"

import { titleCommentCache } from "../../../../../query_key"

import "./style.sass"


export const ReactionComment = memo(({title, uuid, likeCount, dislikeCount, myReaction, queryClient, alias}) => {

    const callback = async (reaction) => {
        if (myReaction == reaction)
            return await api.delete(
                "anime/comments/reaction/delete-reaction", 
                {data: {"reaction_type": reaction, "uuid": uuid, "title": title}}
            ).then(r => r.data)
        else if (myReaction === null)
            return await api.post(
                "anime/comments/reaction/set-reaction", 
                {"reaction_type": reaction, "uuid": uuid, "title": title}
            ).then(r => r.data)
        else if ((myReaction != reaction) && (myReaction !== null))
            return await api.patch(
                "anime/comments/reaction/update-reaction",
                {"reaction_type": reaction, "uuid": uuid, "title": title}
            ).then(r => r.data)
    }

    const mutation = useMutation({
        mutationFn: callback,
        onSuccess: (data) => {
            const reaction = updateReaction(data, myReaction, likeCount, dislikeCount)
            queryClient.setQueryData([titleCommentCache, alias], oldData => {
                if (!oldData?.pages) return oldData

                return {
                    ...oldData,
                    "pages": oldData.pages.map(page => ({
                        ...page,
                        "items": updateCommentInItems(page.items, uuid, reaction)
                    })),
                }
            })
        }
    })

    return(
        <div className="reaction-comment">
            <ul className="reaction-comment__list">
                <li className="reaction-comment__item">
                    <BtnDefault callback={() => mutation.mutate("like")}>
                        <svg
                            className={
                                myReaction === "like" 
                                    ? "reaction-comment-like reaction-comment-like_active" 
                                    : "reaction-comment-like"
                                }
                            xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                            <path 
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M14.54 10.105h5.533c2.546 0-.764 10.895-2.588 10.895H4.964A.956.956 0 0 1 4 
                                    20.053v-9.385c0-.347.193-.666.502-.832C6.564 8.73 8.983 7.824 10.18 5.707l1.28-2.266A.87.87 
                                    0 0 1 12.222 3c3.18 0 2.237 4.63 1.805 6.47a.52.52 0 0 0 .513.635"
                            />
                        </svg>
                    </BtnDefault>
                    <p className="reaction-comment__like-count">
                        {likeCount || 0}
                    </p>
                </li>
                <li className="reaction-comment__item">
                    <BtnDefault callback={() => mutation.mutate("dislike")}>
                        <svg
                            className={
                                myReaction === "dislike" 
                                    ? "reaction-comment-dislike reaction-comment-dislike_active" 
                                    : "reaction-comment-dislike"
                                }
                            xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="1" 
                                d="M10.46 13.895H4.927C2.381 13.895 5.691 3 7.515 3h12.521c.532 0 .964.424.964.947v9.385a.95.95 0 
                                    0 1-.502.832c-2.062 1.106-4.481 2.012-5.678 4.129l-1.28 2.266a.87.87 0 0 1-.762.441c-3.18 
                                    0-2.237-4.63-1.805-6.47a.52.52 0 0 0-.513-.635"
                            />
                        </svg>
                    </BtnDefault>                                
                    <p className="reaction-comment__dislike-count">
                        {dislikeCount || 0}
                    </p>
                </li>
            </ul>
        </div>
    )
})
