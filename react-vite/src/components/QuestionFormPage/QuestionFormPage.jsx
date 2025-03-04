import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { thunkCreateQuestion, thunkLoadAllQuestions } from "../../redux/question"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import "./QuestionForm.css"

function QuestionFormPage() {
    const [title, setTitle] = useState("")
    const [ questionText, setQuestionText] = useState("")
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()

   // Helper function to remove the p tags from the text editor
//    const stripHtmlTags = (html) => {
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = html;
//     return tempDiv.textContent || tempDiv.innerText || '';
//   };

    // Helper function for discarding question
    const handleDiscard = async() => {
        setTitle("")
        setQuestionText("")
        // return
    }
    // Submit function
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Add Validations here:
        const newErrors = {}
        if (title.length < 5) newErrors.title = "Title must be at least 5 characters"
        if (title.length > 50) newErrors.title = "Title must be less than 50 characters"

        if (questionText.length < 25) newErrors.question = "Question must be at least 25 characters"

        if (Object.values(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const question = {
            title,
            question_text: questionText
        }

        try{
            await dispatch(thunkCreateQuestion(question))
            setErrors({})
            navigate("/")
        } catch(error) {
            console.error(error)
        }
    }


    return (
        <div className="question_form_container">
            <form onSubmit={handleSubmit}>
            <div>
                <h2>Create a Question</h2>
                    {errors.title && <p className="error">{errors.title}</p>}
                    {errors.question && <p className="error">{errors.question}</p>}
                    <div className="question_form_content_container">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {/* <textarea
                            type="text"
                            placeholder="Add Question!"
                            value={questionText}
                            onChange={e => setQuestionText(e.target.value)}
                        /> */}

                        <ReactQuill
                        theme="snow"
                        value={questionText}
                        onChange={setQuestionText}
                        />
                    </div>
            </div>
                <div className="create_question_buttons">
                    <button id="create_question_submit_button" type="submit">Submit</button>
                    <button id="create_question_dicard_button" type="button" onClick={handleDiscard}>Discard</button>
                </div>
            </form>

        </div>
    )
}

export default QuestionFormPage