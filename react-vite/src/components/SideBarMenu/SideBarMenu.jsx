import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import "./SideBar.css"

function SideBarMenu() {
    const user = useSelector(state => state.session.user)
    const navigate = useNavigate()


    return (
        <div className="side_bar_menu_container">
            <div>
                <li>
                    <button onClick={()=>navigate("/?page=1")}>
                        Home
                    </button>
                </li>
                <li>
                    <button onClick={()=>navigate("/about")}>
                        About
                    </button>
                </li>

                {
                user ? 
                <div>
                    <li>
                        <button onClick={()=> navigate("/user-questions")}>
                            Questions
                        </button>
                    </li>
                    <li>
                        <button onClick={()=> navigate("/user-comments")}>
                            Comments
                        </button>
                    </li>
                    <li>
                    <button onClick={()=> navigate("/saved-questions")}>
                            Saved Questions
                        </button>
                    </li>
                </div> :
                    <div>
                         
                    </div>
                }
            </div>
        </div>
    )
}

export default SideBarMenu