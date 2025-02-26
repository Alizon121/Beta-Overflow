import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { thunkLoadUserComments } from "../../redux/comment"
import { thunkLoadAllQuestionTitles } from "../../redux/question"
import DeleteCommentModal from "../DeleteCommentModal"
import UpdateCommentModal from "../UpdateCommentModal/UpdateCommentModal"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"

function UserCommentsPage() {
    const user = useSelector(state => state.session.user)
    const comments = useSelector(state => state.comments.comments)
    const questions = useSelector(state => state.questions.questionTitles)
    const [page, setPage] = useState(1)
    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch()

    console.log("PAGEPPAGEPAGEPAGE", page)


    useEffect(() => {
        dispatch(thunkLoadUserComments(page))
        dispatch(thunkLoadAllQuestionTitles())
    }, [dispatch])

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
    };

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
                        <div>{comment?.comment_text}</div>
                        <div>
                            <button>
                                <OpenModalMenuItem
                                    itemText={"Delete"}
                                    modalComponent={<DeleteCommentModal onDelete={onDelete} id={comment?.id} page={page}/>}
                                />
                            </button>
                            <button>
                                <OpenModalMenuItem
                                    itemText={"Update"}
                                    modalComponent={<UpdateCommentModal onUpdate={onUpdate} id={comment.id} page={page}/>}
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