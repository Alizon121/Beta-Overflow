import "./AllQuestions.css"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, NavLink } from "react-router-dom"
import { thunkLoadAllQuestions } from "../../redux/question"
import { thunkLoadQuestionTags } from "../../redux/tag"
import parse from 'html-react-parser'
import "./AllQuestions.css"

function AllQuestionsPage(){ 
const user = useSelector(state => state?.session?.user)
const questions = useSelector(state => state?.questions?.questions)
const allQuestions = useSelector(state => state?.questions?.allQuestions)
const tagsByQuestionId = useSelector(state => state?.tags?.tagsByQuestionId)
const dispatch = useDispatch()
const navigate = useNavigate()
const [page, setPage] = useState(1);
const [disabled, setDisabled] = useState(false)

useEffect(() => {
    if (questions?.length > 0) {
        questions?.forEach(question => 
            dispatch(thunkLoadQuestionTags(Number(question.id)))
        )}
}, [questions, dispatch])

useEffect(() => {
    dispatch(thunkLoadAllQuestions(page))
}, [dispatch, page])

useEffect(() => {
    const fetchData = async () => {        
        const response = await fetch(`/api/questions/${page+1}`)        
        if (response.status !== 404) {
            await dispatch(thunkLoadAllQuestions(page));
        } else {
            setDisabled(true);
        }
    };
    fetchData();
}, [dispatch, page]);


const handleAskQuestion = () => {
    if (!user) navigate("/login")
    else navigate("/question-form")
}

const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
};

const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
    setDisabled(false)
};

return (
    <div>
        {allQuestions ? 
        <div className="all_questions_container">
            <div className="home_page_subheaders">
                {!user ? <h1>Welcome!</h1>: <h1>Welcome, {user.first_name}!</h1>}
                <strong>
                    <i>Find answers to your climbing questions, and help others answer theirs.</i>
                    </strong>
                <div className="all_questions_counter_ask_container">
                    {
                        allQuestions === 1 ? 
                        <p id="question_counter">{allQuestions} question</p> :
                        <p id="question_counter">{allQuestions} questions</p>
                    }
                    <button onClick={handleAskQuestion}>Ask Question</button>
                </div>
            </div>
            <div className="question_content">
                {questions?.map((question, index) => 
                    <div className="all_questions_question_container"  key={index}>
                        <div className="question_container">
                            <h4><NavLink to={`/question/${question?.id}`}>{question?.title}</NavLink></h4>
                            <p>{question?.question_text ? parse(question?.question_text): <h4>Loading question...</h4>}</p>
                            <div>
                                {tagsByQuestionId[Number(question.id)]?.map(tag => (
                                    <span id="all_questions_tag" key={tag.id}>{tag.tag_name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="pagination_controls">
                    <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                    <button onClick={handleNextPage} disabled={disabled}>Next</button>
            </div>
        </div>
        :
        <h2>Loading....</h2>
        }
    </div>          
)}
export default AllQuestionsPage