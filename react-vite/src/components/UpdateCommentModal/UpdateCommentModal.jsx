import { useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { thunkUpdateComment } from "../../redux/comment"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import "./UpdateComment.css"


function UpdateCommentModal({onUpdate, id}) {
    const comments = useSelector(state => state.comments.comments)
    const selectedComment = comments?.find(comment => comment.id === id )
    const [comment, setComment] = useState(selectedComment.comment_text)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const {closeModal} = useModal()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Add validations
        const newErrors={}
        if (comment.length < 22) newErrors.comment = "Comment must be a minimum of 15 characters"

        if (Object.values(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const payload = {
            comment_text: comment
        }

        await dispatch(thunkUpdateComment(id, payload))
        onUpdate()
        closeModal()
    }

    return (
        <div className="update_comment_container">
            <div>
                {errors.comment && <p className="error">{errors.comment}</p>}
                <h2>Update Comment</h2>
                <ReactQuill
                    theme="snow"
                    value={comment}
                    onChange={setComment}
                />
            </div>
            <div className="update_comments_button_container">
                <button id="update_comments_update" type="submit" onClick={handleSubmit}>Update</button>
                <button id="update_comment_cancel" type="button" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default UpdateCommentModal
