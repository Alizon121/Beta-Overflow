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
    if (location.pathname !== "/") {
      dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
    }
    else {
      setIsLoaded(true)
    }
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
          {isLoaded && <Outlet />}
          <SideBarMenu/>
        <Modal />
      </ModalProvider>
    </>
  );
}
