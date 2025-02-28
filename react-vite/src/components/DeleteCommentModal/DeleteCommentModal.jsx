import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkDeleteComment } from "../../redux/comment";
import "./DeleteComment.css"

function DeleteCommentModal({onDelete, id}) {
    const dispatch = useDispatch()
    const {closeModal} = useModal()

    const handleDelete = async (e) => {
        e.preventDefault()
        await dispatch(thunkDeleteComment(id))
        onDelete()
        closeModal()
    }

    return (
        <div className="delete_comment_container">
            <div className="delete_questions_header">
                <h2>Delete Comment</h2>
                <p>Question cannot be recovered once deleted</p>
            </div>
            <div className="delete_comment_buttons_container">
                <button type="submit" onClick={handleDelete}>Delete</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default DeleteCommentModal;