import logo from '/logo.png';
import { useNavigate } from 'react-router-dom';

export default function Header() {

    const navigate = useNavigate();

    return (
        <header className="flex justify-between items-center w-full mb-10 md:mb-15">
            <div className="flex items-center space-x-1">
                <img src={logo} alt="Lexiqo logo" width={45}/>
                <h1 className="font-bold text-[1.2rem]">Lexiqo</h1>
            </div>
            <p className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1.5 rounded">
                Server isn't running yet! Site is under construction.
            </p>
            <button className="bg-white px-4 cursor-pointer hover:bg-gray-100 active:bg-gray-200 py-2 rounded transition-colors" onClick={() => navigate('/login')}>
                Sign In
            </button>
        </header>
    );
}