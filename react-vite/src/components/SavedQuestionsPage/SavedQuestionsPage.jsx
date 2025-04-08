import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { thunkLoadSavedQuestions } from "../../redux/savedQuestion";
import { thunkLoadQuestionsWithContent } from "../../redux/question";
import SavedQuestionMenu from "../SavedQuestionMenu/SavedQuestionMenu";
import "./SavedQuestions.css"
import { thunkLoadQuestionTags } from "../../redux/tag";

function SavedQuestionsPage() {
    const user = useSelector(state => state?.session?.user)
    const savedQuestions = useSelector(state => state?.savedQuestions?.savedQuestionsPaginated)
    const question = useSelector(state => state?.questions?.question)
    const tagsByQuestionId = useSelector(state => state?.tags?.tagsByQuestionId)
    const [page, setPage] = useState(1)
    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkLoadSavedQuestions(page))
        dispatch(thunkLoadQuestionsWithContent())
    }, [dispatch, page])
    
    // Render tags
    // console.log("SASASA", savedQuestions.map(q => q.question_id))
    useEffect(() => {
        if (savedQuestions?.length > 0) {
            savedQuestions?.forEach(question => {
                dispatch(thunkLoadQuestionTags(question.question_id))
            })
        }
    }, [dispatch])

    useEffect(() => {
        const fetchData = async () => {        
            const response = await fetch(`/api/saved-questions/${page+1}`)        
            if (response.status !== 404) {
                await dispatch(thunkLoadSavedQuestions(page));
            } else {
                setDisabled(true);
            }
        };
        fetchData();
    }, [dispatch, page]);


    const onDelete = () => {
        dispatch(thunkLoadSavedQuestions(page))
    }

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    };
    
    const handlePrevPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1));
        setDisabled(false)
    };

    return (
        <div className="saved_question_page_container">
            <h2>{user.first_name}'s Saved Questions</h2>
            <div className="saved_questions_container">
                {/* We need to use the question ids to render the questions */}
                {/* We may need to create a new state variable to render all questions */}
                {savedQuestions?.map(savedQuestion => (
                    question?.filter(q => q.id === savedQuestion.question_id).map(filteredQuestion => (
                        <div key={filteredQuestion.id} className="saved_question">
                            {/* Add the save button icon here */}
                            <div className="saved_question_titles">
                                <li id="saved_question_main_title">{filteredQuestion.title}</li>
                                <li>
                                    <SavedQuestionMenu id={filteredQuestion.id} onDelete={onDelete}/>
                                </li>
                            </div>
                            <li>{filteredQuestion.question_text}</li>
                            <div>
                                {tagsByQuestionId[Number(filteredQuestion.id)]?.map(tag => (
                                <span id="all_questions_tag" key={tag.id}>{tag.tag_name}</span>
                                ))}
                            </div>
                        </div>
                    ))
                ))}
            </div>
            <div className="pagination_controls">
                    <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                    <button onClick={handleNextPage} disabled={disabled}>Next</button>
            </div>
        </div>
    )
}

export default SavedQuestionsPage;