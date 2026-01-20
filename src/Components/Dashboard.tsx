import { useEffect, useState } from "react";
import { useUser } from "../contexts/userContext";
import HeaderComponent from "./DashBoardComponents/Header";
import Footer from "./DashBoardComponents/Footer";
import { Outlet } from "react-router-dom";
import { sendRequest } from "../utils/ApiUtils";
import { useNav } from "../contexts/headerAndFooterContext";

export default function Dashboard() {

    const { user, setUser } = useUser();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const { showHeader, showFooter } = useNav();

    useEffect(() => {
        if (!user) {
            setIsLoading(true);

            sendRequest(`${import.meta.env.VITE_BACKEND_URL}/api/user`, 'GET').then((data) => {

                if (data && data.user) {
                    setUser(data.user);
                } else if (data && data.error) {
                    setUser(null);
                    alert(data.message);
                } else {
                    setUser(null);
                    alert("Failed to fetch user data.");
                }

                setIsLoading(false);

            });
        }
    }, []);

    return (
        <div className="">
            {showHeader && <HeaderComponent/>}
            <main className={`${showHeader ? 'pt-26 md:pt-13' : 'pt-0'} ${showFooter ? 'pb-19' : 'pb-0'} pl-0 md:pl-50 max-w-[115rem] m-auto`}>
                { isLoading ? <div className="pt-40 text-center text-lg font-medium">Loading...</div> : <Outlet/> }
            </main>
            {showFooter && <Footer/>}
        </div>
    );
}