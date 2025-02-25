import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import "./SideBar.css"

function SideBarMenu() {
    const user = useSelector(state => state.session.user)
    const navigate = useNavigate()


    return (
        <div className="side_bar_menu_container">
            <ul>
                <li>
                    <button onClick={()=>navigate("/")}>
                        Home
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
                </div> :
                    <div>
                         {/* <li>
                            <button onClick={()=> navigate("/")}>
                                Questions
                            </button>
                        </li> */}
                    </div>
                }
            </ul>
        </div>
    )
}

export default SideBarMenu