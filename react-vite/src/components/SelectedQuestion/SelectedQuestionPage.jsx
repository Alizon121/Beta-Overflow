import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkLoadSelectionQuestion } from "../../redux/question";
import CreateCommentSection from "../CreateCommentSection";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import parse from 'html-react-parser'
import "./SelectedQuestion.css"
import { thunkAddSavedQuestion, thunkDeleteSavedQuestion, thunkLoadAllSavedQuestions } from "../../redux/savedQuestion";

function SelectedQuestionPage () {
    const {id} = useParams()
    const [count, setCount] = useState()
    const [bookMarked, setBookMarked] = useState(false);
    const hasRunEffect = useRef(false)
    const dispatch = useDispatch()
    const question = useSelector(state => state?.questions?.userQuestion)
    const comments = useSelector(state => state?.questions?.comments)
    const users = useSelector(state => state?.questions?.users)
    const userSavedQuestions = useSelector(state => state?.savedQuestions?.allSavedQuestions)

    useEffect(() => {
        dispatch(thunkLoadSelectionQuestion(Number(id)))
        dispatch(thunkLoadAllSavedQuestions())
    }, [dispatch, id])

    // Use for counting visits
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

    useEffect(() => {
        if (userSavedQuestions && id) {
            checkBookMarked()
        }
    }, [userSavedQuestions, id])

    // Function for getting the bookmarked value form the state variable
    const checkBookMarked = () => {
        const savedQuestion = userSavedQuestions?.find(savedQuestion => savedQuestion.question_id === Number(id))
        if (savedQuestion?.bookmarked === true) setBookMarked(true)
        else setBookMarked(false)
    }

    // Function for re-rendering the thunk
    const onCreate = () => {
        dispatch(thunkLoadSelectionQuestion(Number(id)))
    }

    // Function for changing bookmarking
        const toggleBookMark = () => {
            setBookMarked(!bookMarked)

            if (!bookMarked) {
                dispatch(thunkAddSavedQuestion(id));
            } else {
                dispatch(thunkDeleteSavedQuestion(id));
            }
        }

    return (
        <div className="selected_question_page_container">
            {question ? (
                <h2 className="selected_question_title">
                    {question?.title}
                    <div id="selected_question_bookmark" onClick={toggleBookMark}>
                        {
                            (!bookMarked)
                                ? <FaRegBookmark size={18} />
                                : <FaBookmark size={18} />
                        }
                    </div>
                </h2>
            ) : (
                <h2>Loading Question Title...</h2>
            )}
            <div>
                {
                    question ? 
                    <div>
                        <div className="selected_question_subheaders">
                            <li>Asked on {question?.created_at}</li>
                            <li>Viewed {count} times</li>
                        </div>
                        <div className="selected_question_question_content_container">
                            <div id="selected_question_question">
                                {question?.question_text ? parse(question.question_text): ''}
                            </div>
                        </div>
                    </div>:
                    <h3>Loading Question...</h3>
                }

                <div className="selected_question_comment_container">
                    <h2>Responses</h2>
                    <div className="selected_question_comment_content_container">
                        {(typeof comments !== "string") ? 
                        comments?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(comment => {
                            const selectedUserInfo = users?.find(user => user.id === comment.user_id)
                            return (
                                <div key={comment?.id}>
                                    <div id="selected_question_comment_text">
                                        {comment?.comment_text ? parse(comment?.comment_text): ''}
                                        </div>
                                    <div className="selected_question_comment_">
                                        {selectedUserInfo && 
                                            <div className="selected_question_comment_username_date">
                                                <p>Posted by: {selectedUserInfo?.username}</p>
                                                <p>Created on: {comment?.created_at}</p>
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