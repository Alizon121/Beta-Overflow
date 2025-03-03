import { useEffect } from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { thunkLoadAllQuestionTitles, thunkLoadQuestionsWithContent } from "../../redux/question"
import parse from 'html-react-parser'
import "./QuestionsList.css"

function QuestionsListPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 5
    const question = useSelector(state => state.questions.question)
    const query = useSelector(state => state.query)
    const dispatch = useDispatch()
    const queryString = Object.values(query).join('').toLowerCase()


    useEffect(() => {
        dispatch(thunkLoadQuestionsWithContent())
    }, [dispatch])
    
    useEffect(() => {
        const loadTitles = async () => {
            await dispatch(thunkLoadAllQuestionTitles())
        }
        loadTitles()
    }, [dispatch])

    const filteredQuestions = question?.filter(question => 
        question.title.toLowerCase().includes(queryString)
    )

    const totalItems = filteredQuestions?.length
    const totalPages = Math.ceil(totalItems/perPage)

    function displayData(page) {
        const startIndex = (page-1)* perPage
        const endIndex = startIndex + perPage
        return filteredQuestions.slice(startIndex, endIndex)
    }


    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    
    return (
        <div className="questions_list_container">
            <h2>Search Results</h2>
            {filteredQuestions?.length > 0?
            displayData(currentPage)?.map(question => (
                <div className="questions_list_content_container" key={question.id}>
                    <h4><NavLink to={`/question/${question.id}`}>
                            {question.title}
                        </NavLink>
                    </h4>
                    <p>{parse(question.question_text)}</p>
                </div>
            ))
        :
            <p>No results found</p>
        }
          <div className="pagination_controls">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    )
}

export default QuestionsListPage