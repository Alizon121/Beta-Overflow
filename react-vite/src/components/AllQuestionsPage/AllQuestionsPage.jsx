import "./AllQuestions.css"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { thunkLoadAllQuestions } from "../../redux/question"

function AllQuestionsPage(){
// We want to display the paginated questions 
const user = useSelector(state => state.session.user)
const questions = useSelector(state => state.questions.questions)
const dispatch = useDispatch()
const navigate = useNavigate()


useEffect(() => {
    dispatch(thunkLoadAllQuestions())
}, [thunkLoadAllQuestions])


const handleAskQuestion = () => {
    if (!user) {
        navigate("/login")
    } else {
        navigate("/questionForm")
    }
}

return (
    <div>
        <div className="home_page_subheaders">
            <h1>Newest Questions</h1>
            <button onClick={handleAskQuestion}>Ask a Question</button>
        </div>
        <div>
            {questions?.map((question, index) => 
                <div className="all_questions_question_container">
                    <div key={index}>
                    <h4>{index+1}. {question.title}</h4>
                    <p>{question.question_text}</p>
                    </div>
                </div>
            )}
        </div>
    </div>          
)


}

export default AllQuestionsPage