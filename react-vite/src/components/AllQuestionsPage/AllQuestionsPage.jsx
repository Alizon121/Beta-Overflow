import "./AllQuestions.css"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useLocation, NavLink } from "react-router-dom"
import { thunkLoadAllQuestions } from "../../redux/question"
import "./AllQuestions.css"

function AllQuestionsPage(){ 
const user = useSelector(state => state.session.user)
const questions = useSelector(state => state.questions.questions)
const allQuestions = useSelector(state => state.questions.allQuestions)
const dispatch = useDispatch()
const navigate = useNavigate()
const [page, setPage] = useState(1);
const [disabled, setDisabled] = useState(false)


useEffect(() => {
    dispatch(thunkLoadAllQuestions(page))
}, [dispatch, page])

useEffect(() => {
    if (questions?.length < 5) {
        setDisabled(true)
    } else {
        setDisabled(false)
    }
}, [questions])

const handleAskQuestion = () => {
    if (!user) navigate("/login")
    else navigate("/question-form")
}

const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
};

const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
};

return (
    <div className="all_questions_container">
        <div className="home_page_subheaders">
            <h1>Newest Questions</h1>
            <div className="all_questions_counter_ask_container">
                <p>{allQuestions} questions</p>
                <button onClick={handleAskQuestion}>Ask Question</button>
            </div>
        </div>

        
        <div className="question_content">
            {questions?.map((question, index) => 
                <div className="all_questions_question_container"  key={index}>
                    <div className="question_container">
                        <h4><NavLink to={`/question/${question.id}`}>{question.title}</NavLink></h4>
                        <p>{question.question_text}</p>
                    </div>
                </div>
            )}
        </div>
        <div className="pagination_controls">
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <button onClick={handleNextPage} disabled={disabled}>Next</button>
        </div>
    </div>          
)}
export default AllQuestionsPage