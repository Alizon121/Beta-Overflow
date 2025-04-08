import { csrfFetch } from "./csrf"


/************Action **************/

const LOAD_TAGS = "tags/loadTags"

const LOAD_QUESTION_TAGS = "tags/loadQuestionTags"

/**********Action Creator **********/
const loadTags = (tag) => ({
    type: LOAD_TAGS,
    payload: tag
})

const loadQuestionTags = (tag) => ({
    type: LOAD_QUESTION_TAGS,
    payload: tag
})

/*************Thunk Action **********/
export const thunkLoadTags = () => async dispatch => {
    const response = await csrfFetch("/api/tags/", {
            method: "GET"
        })

    if (response.ok) {
        const data = await response.json()
        dispatch(loadTags(data))
        return data
    }
}

export const thunkLoadQuestionTags = (id) => async dispatch => {
    const response = await csrfFetch(`/api/questions/${id}/tags`)
    if (response.ok) {
        const data = await response.json()
        dispatch(loadQuestionTags({questionId: id, tags: data.tags}))
        return data
    }
}

/************** Reducer Function ***************/
function tagReducer(state = {tagsByQuestionId:{}}, action) {
    switch(action.type){
        case LOAD_TAGS:
            const newState = {};
            action.payload.allTags.forEach(tag => {
                newState[tag.id] = tag;
            });
            return newState
        case LOAD_QUESTION_TAGS:
            const { questionId, tags } = action.payload;
            return {
                ...state,
                tagsByQuestionId: {
                    ...state.tagsByQuestionId,
                    [questionId]: tags
                }
            }

        default:
            return state
    }
}

export default tagReducer;