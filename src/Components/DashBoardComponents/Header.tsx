import { useUser } from "../../contexts/userContext";
import logo from "/blackLogo.png"
import PremiumButton from "../UI/PremiumButton";
import QuickSearchInput from "../UI/QuickSearchInput";

export default function HeaderComponent() {

    const { user } = useUser();
    //TODO: Use user data to show profile picture and hotness score

    return (
        <header className="flex fixed flex-col top-0 left-0 right-0 bg-white/70 backdrop-blur-md z-100 pb-9 md:pb-0">
            <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-row justify-center items-center">
                    <img src={logo} alt="Logo" width={60} className="translate-y-0.5"/>
                    <PremiumButton/>
                </div>
                <div className="flex flex-row items-center gap-1.5 mr-2">
                    <div className="flex flex-row items-center gap-0.5 text-fire">
                        <p className="font-semibold text-lg">0</p>
                        <i className='bx bxs-hot text-lg'></i>
                    </div>
                    <div className="">
                        <img src="/avatars/default.png" alt="profile picture" width={40} className="rounded-full "/>
                    </div>
                    <div>
                        <i className='bx bx-menu text-4xl'></i>
                    </div>
                </div>
            </div>
            <QuickSearchInput/>
        </header>
    );
}