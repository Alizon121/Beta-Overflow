import { csrfFetch } from "./csrf"

/*Actions */
const LOAD_ALL_QUESTIONS = "questions/loadAllQuestions"

/***********************Action Creators *********************/

const loadAllQuestions = (question) => ({
    type: LOAD_ALL_QUESTIONS,
    payload: question
})

/**************************Thunk Actions *******************/ 

export const thunkLoadAllQuestions = (page) => async dispatch => {

    if (!page) page=1

    const response = await fetch(`/api/questions/${page}`)

    if (response.ok) {
        const data = await response.json()
        dispatch(loadAllQuestions(data))
        return data
    }
}







/******************Reducer *********************************/

function questionReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_ALL_QUESTIONS:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default questionReducer