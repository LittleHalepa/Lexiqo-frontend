import { useNavigate, useLocation } from "react-router-dom";

export const Modes = ({isLoading, collection} : any) => {

    const nav = useNavigate();
    const location = useLocation();

    const handleFlashcardsButtonClick = () => {

        if (isLoading) return;

        nav(`${location.pathname}/flashcards`, {state: { collection: collection}});
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 w-full">
            <div className={`flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg hover:shadow-sm cursor-pointer gap-2 transition-shadow ${isLoading ? 'bg-gray-200 animate-pulse' : 'bg-white animate-none'} transition-all`} onClick={handleFlashcardsButtonClick}>
                <i className={`bx bxs-collection text-3xl ${isLoading ? 'text-gray-500' : 'text-black'}`}></i>
                <h2 className={`font-semibold text-lg ${isLoading ? 'text-gray-500' : 'text-black'}`}>Flashcards</h2>
            </div>
            <div className={`flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg hover:shadow-sm cursor-pointer gap-2 transition-shadow ${isLoading ? 'bg-gray-200 animate-pulse' : 'bg-white animate-none'} transition-all`}>
                <i className={`bx bxs-brain text-3xl ${isLoading ? 'text-gray-500' : 'text-black'}`}></i>
                <h2 className={`font-semibold text-lg ${isLoading ? 'text-gray-500' : 'text-black'}`}>Learn</h2>
            </div>
            <div className={`flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg hover:shadow-sm cursor-pointer gap-2 transition-shadow ${isLoading ? 'bg-gray-200 animate-pulse' : 'bg-white animate-none'} transition-all`}>
                <i className={`bx bxs-graduation text-3xl ${isLoading ? 'text-gray-500' : 'text-black'}`}></i>
                <h2 className={`font-semibold text-lg ${isLoading ? 'text-gray-500' : 'text-black'}`}>Test</h2>
            </div>
            <div>
                <div className={`relative flex flex-col items-center justify-center p-6 border border-gray-300 rounded-sm hover:shadow-sm cursor-pointer gap-2 transition-shadow ${isLoading ? 'bg-gray-200 animate-pulse' : 'bg-gradient-to-tr from-yellow-400/30 to-purple-600/30 animate-none'}`}>
                    <i className={`bx bxs-game text-3xl ${isLoading ? 'text-gray-500 animate-pulse' : 'text-purple-600 animate-none'}`}></i>
                    <h2 className={`font-semibold text-lg  ${isLoading ? 'text-gray-500 animate-pulse' : 'bg-gradient-to-r from-yellow-600 to-purple-600 bg-clip-text text-transparent animate-none'}`}>Challenge</h2>
                </div>
            </div>
        </div>
    );
}