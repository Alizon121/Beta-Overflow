import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import SideBarMenu from "../components/SideBarMenu/SideBarMenu";
import NavigationLoginPage from "../components/Navigation/NavigationLoginPage";
import "./LayoutStyle.css"

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== "/"&& location.pathname !== "/login" && location.pathname !== "/signup")  {
      dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
    }
    else {
      setIsLoaded(true)
    }
  }, [dispatch, location.pathname]);

  return (
    <>
      <ModalProvider>
        <div>
          {location.pathname === "/login" && 
            <NavigationLoginPage />
          }
        </div>
       <div className="layout_container">
        <div className="main_content">
            {isLoaded && <Outlet />}
        </div>
          <div id="side_bar_menu_container">
            {location.pathname !== "/login" && location.pathname !== "/signup" && (
                <SideBarMenu />
            )}
          </div>

       </div>
        <Modal />
      </ModalProvider>
    </>
  );
}
