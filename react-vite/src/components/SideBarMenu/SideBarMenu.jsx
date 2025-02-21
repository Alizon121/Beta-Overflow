import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

function SideBarMenu() {
    const user = useSelector(state => state.session)
    const navigate = useNavigate()


    return (
        <div>
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
                        <button onClick={()=> navigate("/questions")}>
                            Questions
                        </button>
                    </li>
                    <li>
                        <button onClick={()=> navigate("/comments")}>
                            Comments
                        </button>
                    </li>
                </div> :
                    <div></div>
                }
            </ul>
        </div>
    )
}

export default SideBarMenu