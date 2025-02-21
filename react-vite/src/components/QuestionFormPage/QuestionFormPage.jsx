import { useState } from "react"


function QuestionFormPage() {
    const [title, setTitle] = useState("")
    const [ question, setQuestion] = useState("")

    // Add Validations here:


    return (
        <div>
            <h2>Create a Question</h2>
            <form>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                {/* Add errors here */}
                <input
                    type="text"
                    placeholder="Add Question!"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                />
            </form>

        </div>
    )
}

export default QuestionFormPage