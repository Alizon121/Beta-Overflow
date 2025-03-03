import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { setQuery } from "../../redux/query"
import "./SearchBarStyles.css"


function SearchBar() {
// const query = useSelector(state => state.query)
const dispatch = useDispatch()
const [search, setSearch] = useState('')
const navigate = useNavigate()



const handleChange = (e) => {
    const newQuery = e.target.value;
    setSearch(newQuery);
}

const handleSubmit = async (e) => {
    e.preventDefault()
    await dispatch(setQuery(search));
    navigate("/question-list")
}

return (
    <div className="search_bar_container">
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleChange}
            />
        </form>
    </div>
)

}

export default SearchBar