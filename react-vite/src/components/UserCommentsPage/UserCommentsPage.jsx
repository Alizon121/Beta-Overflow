import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { thunkLoadUserComments } from "../../redux/comment"
import { thunkLoadAllQuestionTitles } from "../../redux/question"

function UserCommentsPage() {
    const user = useSelector(state => state.session.user)
    const comments = useSelector(state => state.comments.comments)
    const questions = useSelector(state => state.questions.questionTitles)
    const [page, setPage] = useState(1)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(thunkLoadUserComments(page))
        dispatch(thunkLoadAllQuestionTitles())
    }, [dispatch])


    return (
        <div>
            <h2>{user?.username}'s Comments</h2>
            <div>{comments?.length > 0 ? comments?.map(comment => {
                const question = questions?.find(question => question.id === comment.question_id)
                return (
                    <div key={comment.id}>
                         {question && (
                            <div>
                                <div>{question.title}</div>
                            </div>
                        )}
                        <div>{comment.comment_text}</div>
                    </div>
                );
            }) : (
                <p>No comments yet!</p>
            )}</div>
         </div>
    )}


export default UserCommentsPage