import { json } from "react-router-dom"
import { csrfFetch } from "./csrf"

/*Actions */
const LOAD_ALL_QUESTIONS = "questions/loadAllQuestions"

const CREATE_QUESTION = "questions/createQuestion"

/***********************Action Creators *********************/

const loadAllQuestions = (question) => ({
    type: LOAD_ALL_QUESTIONS,
    payload: question
})

const createQuestion = (question) => ({
    type: CREATE_QUESTION,
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

export const thunkCreateQuestion = (question) => async dispatch => {
    const response = await csrfFetch("/api/questions/", {
        method: 'POST',
        body: JSON.stringify(question)
    })

    if (response.ok) {
        const data = await response.json()
        console.log("DATDATDTATDATDATDTAADTDATA", data)
        dispatch(createQuestion(data))
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
        case CREATE_QUESTION:
            // console.log("POPOPOPOPOPO", action.payload)
            return {
                // ...state,
                // allQuestions: Number(state?.questions?.allQuestions) + 1,
                // questions: state?.questions?.questions ?
                // [...state.questions.questions, ...action.payload] :
                // []
                ...state,
                allQuestions: state.allQuestions + 1,
                questions: [...state.questions, action.payload]
            }
        default:
            return state
    }
}

export default questionReducer