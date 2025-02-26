import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkDeleteComment } from "../../redux/comment";

function DeleteCommentModal({onDelete, id}) {
    const dispatch = useDispatch()
    const {closeModal} = useModal()

    console.log("gfgfgfgfgf", id)

    const handleDelete = async (e) => {
        e.preventDefault()
        await dispatch(thunkDeleteComment(id))
        onDelete()
        closeModal()
    }

    return (
        <div>
            <h2>Delete Comment</h2>
            <p>Question cannot be recovered once deleted</p>
            <div>
                <button type="submit" onClick={handleDelete}>Delete</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default DeleteCommentModal;