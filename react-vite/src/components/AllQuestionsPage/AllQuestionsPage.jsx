import "./AllQuestions.css"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { thunkLoadAllQuestions } from "../../redux/question"

function AllQuestionsPage(){
// We want to display the paginated questions 
const user = useSelector(state => state.session)
const questions = useSelector(state => state.questions.questions)
const dispatch = useDispatch()
const navigate = useNavigate()

useEffect(() => {
    dispatch(thunkLoadAllQuestions())
}, [thunkLoadAllQuestions])



return (
    <div>
        <div className="home_page_subheaders">
            <h1>Newest Questions</h1>
            <button onClick={()=> navigate("/questionForm")}>Ask a Question</button>
        </div>
        <body>
            {questions?.map((question, index) => 
                <div>
                    {index+1}. {question.question_text}
                </div>
            )}
        </body>
    </div>          
)


}

export default AllQuestionsPage