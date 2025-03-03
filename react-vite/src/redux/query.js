/********************Action ********************/
const SET_QUERY = "queries/setQuery"

/****************Action Creator ******************/
export const setQuery = (query) => ({
    type: SET_QUERY,
    payload: query
})

/********************Reducer Function ***************/
function queryReducer(state={}, action) {
    switch(action.type) {
        case SET_QUERY: 
        return {
          ...action.payload
        }
        default:
            return state
    }
}

export default queryReducer