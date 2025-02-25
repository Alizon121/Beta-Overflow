import { csrfFetch } from "./csrf"

/************** Actions ***************/ 
const LOAD_USER_COMMENTS = "comments/loadUserComments"

// const ADD_ANSWER = "comments/addAnswer"

/*************** Action Creators ******************/

const loadUserQuestions = (comment) => ({
    type: LOAD_USER_COMMENTS,
    payload: comment
})

// const addAnswer = (answer) => ({
//     type: ADD_ANSWER,
//     payload: answer
// })

/******************* Thunk Actions ****************/

export const thunkLoadUserComments= (page) => async dispatch => {
    const response = await csrfFetch(`/api/comments/${page}`)

    if (response.ok) {
        const data = await response.json()
        dispatch(loadUserQuestions(data))
        return data
    }
}

// export const thunkAddAnswer = (id, answer) => async dispatch => {
//     const response = await csrfFetch(`/api/questions/${id}/comments`, {
//         method: "POST",
//         body: JSON.stringify(answer)
//     })

//     if (response.ok) {
//         const data = await response.json()
//         console.log("DATATATAT", data)
//         dispatch(addAnswer(data.comment))
//     }
// }

/******************* Reducer *************************/

function commentReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_USER_COMMENTS:
            return {
                ...state,
                ...action.payload
            }
        // case ADD_ANSWER:
        //     const initialState = {
        //         questions: {
        //             comments: [],
        //             userQuestion: {},
        //             users:[]
        //         }
        //     }
        //     return {
        //         ...initialState,
        //         questions:{
        //         //    ...state.questions,
        //         //    comments: [...state.questions?.comments, action.payload],
        //         //    users: []
        //         }
        //     } 
                default:
            return state
    }
}

export default commentReducer