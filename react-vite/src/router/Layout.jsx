import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import SideBarMenu from "../components/SideBarMenu/SideBarMenu";
import NavigationLoginPage from "../components/Navigation/NavigationLoginPage";
import NavigationSignup from "../components/Navigation/NavigationSignup";
import "./LayoutStyle.css"
import ChatWidget from "/src/components/ChatWidget/ChatWidget.jsx";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation()

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    if (!isAuthPage) {
      dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
    } else {
      setIsLoaded(true)
    }
  }, [isAuthPage, dispatch, location.pathname]);

  if (isAuthPage) {
    return (
      <ModalProvider>
        <div className="auth_shell">
          {location.pathname === "/login" ? <NavigationLoginPage /> : <NavigationSignup />}
          <div className="auth_content">
            {isLoaded && <Outlet />}
          </div>
        </div>
        <Modal />
      </ModalProvider>
    );
  }

  return (
    <ModalProvider>
      <div className="app_shell">
        <aside className="app_sidebar">
          <SideBarMenu />
        </aside>
        <div className="app_right">
          <Navigation />
          <main className="main_content">
            {isLoaded && <Outlet />}
          </main>
        </div>
      </div>
      <ChatWidget />
      <Modal />
    </ModalProvider>
  );
}
