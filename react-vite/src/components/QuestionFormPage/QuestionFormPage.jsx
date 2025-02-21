import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { thunkCreateQuestion, thunkLoadAllQuestions } from "../../redux/question"


function QuestionFormPage() {
    const [title, setTitle] = useState("")
    const [ questionText, setQuestionText] = useState("")
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkLoadAllQuestions())
    }, [dispatch])

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
            const response = await dispatch(thunkCreateQuestion(question))
            console.log(response)
        } catch(error) {
            console.error(error)
        }
    }


    return (
        <div>
            <h2>Create a Question</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                {errors.title && <p className="error">{errors.title}</p>}
                <textarea
                    type="text"
                    placeholder="Add Question!"
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                />
                {errors.question && <p className="error">{errors.question}</p>}
                <div className="create_question_buttons">
                    <button id="create_question_submit_button" type="submit">Submit</button>
                    <button id="create_question_dicard_button" type="button" onClick={handleDiscard}>Discard</button>
                </div>
            </form>

        </div>
    )
}

export default QuestionFormPage