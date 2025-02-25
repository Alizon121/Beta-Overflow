import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadSelectionQuestion } from "../../redux/question";
import CreateCommentSection from "../CreateCommentSection";

function SelectedQuestionPage () {
    const {id} = useParams()
    const [count, setCount] = useState()
    const hasRunEffect = useRef(false)
    const dispatch = useDispatch()
    const question = useSelector(state => state.questions.userQuestion)
    const comments = useSelector(state => state.questions.comments)
    const users = useSelector(state => state.questions.users)


    useEffect(() => {
        dispatch(thunkLoadSelectionQuestion(id))
    }, [dispatch, id])

    useEffect(() => {
        if (!hasRunEffect.current){
            hasRunEffect.current=true
            const key = `pageVisits_${id}`;
            const storedCount = localStorage.getItem(key);
            const initialCount = storedCount ? Number(storedCount) : 0
            setCount(initialCount + 1)
            localStorage.setItem(key, initialCount +1)
        }
    }, [id])

    // Function for re-rendering the thunk
    const onCreate = () => {
        dispatch(thunkLoadSelectionQuestion(id))
    }


    return (
        <div>
            <h2>{question?.title}</h2>
            <div>
                <li>Asked on {question?.created_at}</li>
                <li>Viewed {count} times</li>
                <div>
                    <h3>{question?.title}</h3>
                    <div>{question?.question_text}</div>
                </div>

                <div>
                    <div>{comments?.length >0 ? 
                        comments?.map(comment => {
                            const selectedUserInfo = users?.find(user => user.id === comment.user_id)
                            return (
                                <div key={comment?.id}>
                                    <div>{comment?.comment_text}</div>
                                    <div>
                                        {selectedUserInfo && 
                                            <div>
                                                <div>Posted by: {selectedUserInfo?.username}</div>
                                                <div>Created on: {comment?.created_at}</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )}):
                        <div></div>
                        }
                    </div>
                </div>
                {/* Add create a comment component here */}
                <CreateCommentSection onCreate={onCreate} questionId={question?.id} />
            </div>
        </div>
    )
}

export default SelectedQuestionPage;