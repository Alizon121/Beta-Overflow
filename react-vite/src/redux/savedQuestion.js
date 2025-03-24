import { csrfFetch } from "./csrf"

/************************ Actions ****************************/ 
const LOAD_SAVED_QUESTIONS = "saved-questions/loadSavedQuestions"


/**************************Action Creators ********************/
const loadSavedQuestions = (savedQuestion) => ({
    type: LOAD_SAVED_QUESTIONS,
    payload: savedQuestion
})


/**********************Thunk Actions ***************************/
export const thunkLoadSavedQuestions = (page) => async dispatch => {
    const response = await csrfFetch(`/api/saved-questions/${page}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(loadSavedQuestions(data))
        return data
    }
}

/*************************** Reducer ****************************/
function savedQuestionReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_SAVED_QUESTIONS:
            return{
                ...state,
                ...action.payload
            }
        default:
            return state    
    }
}

export default savedQuestionReducer;