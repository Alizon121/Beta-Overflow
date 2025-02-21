import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import SideBarMenu from "../components/SideBarMenu/SideBarMenu";

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
        <Navigation />
          {isLoaded && <Outlet />}
          {location.pathname !== "/login" && location.pathname !== "/signup" && (
            <div>
              <SideBarMenu />
            </div>
          )}
        <Modal />
      </ModalProvider>
    </>
  );
}
