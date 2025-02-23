import { csrfFetch } from "./csrf"

/************** Actions ***************/ 
const LOAD_USER_COMMENTS = "comments/loadUserComments"

/*************** Action Creators ******************/

const loadUserQuestions = (comment) => ({
    type: LOAD_USER_COMMENTS,
    payload: comment
})

/******************* Thunk Actions ****************/

export const thunkLoadUserComments= (page) => async dispatch => {
    const response = await csrfFetch(`/api/comments/${page}`)

    if (response.ok) {
        const data = await response.json()
        dispatch(loadUserQuestions(data))
        return data
    }
}

/******************* Reducer *************************/

function commentReducer(state = {}, action) {
    switch(action.type) {
        case LOAD_USER_COMMENTS:
            
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default commentReducer