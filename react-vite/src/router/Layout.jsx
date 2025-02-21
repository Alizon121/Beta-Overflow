import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import SideBarMenu from "../components/SideBarMenu/SideBarMenu";
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
       <div className="layout_container">
        <div className="main_content">
          <Navigation />
            {isLoaded && <Outlet />}
        </div>
          <div>
            {location.pathname !== "/login" && location.pathname !== "/signup" && (
              <div id="side_bar_menu_container">
                <SideBarMenu />
              </div>
            )}
          </div>

       </div>
        <Modal />
      </ModalProvider>
    </>
  );
}
