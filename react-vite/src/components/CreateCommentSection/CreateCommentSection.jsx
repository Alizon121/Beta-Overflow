import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkAddAnswer } from "../../redux/question"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import "./CreateComment.css"

function CreateCommentSection({onCreate, questionId}) {
    const dispatch = useDispatch()
    const [commentText, setCommentText] = useState("")
    const [errors, setErrors] = useState({})
    const user = useSelector(state => state.session.user)

    // Helper function to remove the p tags from the text editor
    const removePTags = (html) => {
        if (html.startsWith('<p>') && html.endsWith('</p>')) {
          html = html.slice(3, -4);
        }
        return html;
      };


    const handleSubmit = async (e) => {
        e.preventDefault()

        //  Add validations here
        const newErrors = {}
        if (!user) newErrors.user = "User must be logged in to post a comment"
        if (commentText.length < 15) newErrors.commentText = "Comment must be a minimum of 15 characters"

        if (Object.values(newErrors).length > 0) {
            setErrors(newErrors)
        }

        const payload = {
            comment_text: removePTags(commentText)
        }

        try{
            await dispatch(thunkAddAnswer(questionId, payload))
            setCommentText("")
            setErrors({})
            onCreate()
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <div className="create_comment_container">
            <form onSubmit={handleSubmit}>
                {errors.commentText && <p className="error">{errors.commentText}</p>}
                {errors.user && <p className="error">{errors.user}</p>}
                <div>
                    <h2>Your Answer</h2>
                    <div className="creat_comment_rq_container">
                        <ReactQuill theme="snow"  value={commentText} onChange={setCommentText}/>                  
                    </div>
                </div>
                <div id="create_comment_post_container">
                    <button type="submit">Post Answer</button>
                </div>
            </form>
        </div>
    )
}

export default CreateCommentSection