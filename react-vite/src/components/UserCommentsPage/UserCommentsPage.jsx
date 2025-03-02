import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { thunkLoadUserComments } from "../../redux/comment"
import { thunkLoadAllQuestionTitles } from "../../redux/question"
import DeleteCommentModal from "../DeleteCommentModal"
import UpdateCommentModal from "../UpdateCommentModal/UpdateCommentModal"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import parse from 'html-react-parser'
import "./UserComments.css"

function UserCommentsPage() {
    const user = useSelector(state => state.session.user)
    const comments = useSelector(state => state.comments.comments)
    const questions = useSelector(state => state.questions.questionTitles)
    const [page, setPage] = useState(1)
    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(thunkLoadUserComments(page))
        dispatch(thunkLoadAllQuestionTitles())
    }, [dispatch, page])

useEffect(() => {
    if (comments?.length < 3) {
        setDisabled(true)
    } else {
        setDisabled(false)
    }
}, [comments])


    // Make helper function to render component when comment deleted
    const onDelete = () => {
        dispatch(thunkLoadUserComments(page))
    }

    // May need to add page as a parameter when pagination is used
    const onUpdate = () => {
        dispatch(thunkLoadUserComments(page))
    }

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    };
    
    const handlePrevPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1));
        setDisabled(false)
    };

    // comments.map(comment => console.log(typeof parse(comment.comment_text)))

    return (
        <div className="user_comments_page_container">
            <h2>{user?.username}'s Comments</h2>
            <div className="user_commments_content_container">
                {comments?.length > 0 ? comments?.map(comment => {
                const question = questions?.find(question => question.id === comment.question_id)
                return (
                    <div className="user_comments_title_comment_buttons" key={comment.id}>
                         {question && (
                            <div className="user_comments_question_header">
                                <h4>{question.title}</h4>
                            </div>
                        )}
                        <div>{parse(comment?.comment_text)}</div>
                        <div className="user_comments_buttons_container">
                            <button id="user_comments_update_button">
                                <OpenModalMenuItem
                                    itemText={"Update"}
                                    modalComponent={<UpdateCommentModal onUpdate={onUpdate} id={comment.id} page={page}/>}
                                />
                            </button>
                            <button id="user_comments_delete_button">
                                <OpenModalMenuItem
                                    itemText={"Delete"}
                                    modalComponent={<DeleteCommentModal onDelete={onDelete} id={comment?.id} page={page}/>}
                                />
                            </button>
                        </div>
                    </div>
                );
            }) : (
                <p>No comments yet!</p>
            )}</div>
        
            <div className="pagination_controls">
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <button onClick={handleNextPage} disabled={disabled} >Next</button>
            </div>
         </div>
    )}


export default UserCommentsPage