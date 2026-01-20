import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Footer() {
  const [activeNav, setActiveNav] = useState("");
  const navigate = useNavigate();
  const { publicId } = useParams();

  if (!publicId) return null; 

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const lastSegment = segments[segments.length - 1];
    setActiveNav(lastSegment);
  }, []);

  const handleNavClick = (target: string) => {
    setActiveNav(target);
    navigate(`/user/${publicId}/dashboard/${target}`);
  };

  const navItems = [
    { id: "add-collection", icon: "bxs-layer-plus", label: "Add" },
    { id: "home", icon: "bxs-home", label: "Home" },
    { id: "library", icon: "bx-library", label: "Library" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full md:top-26 md:gap-2 md:flex-col md:w-48 md:py-5 bg-white/70 backdrop-blur-md flex flex-row justify-around items-end h-18 z-100">
      {navItems.map(({ id, icon, label }) => {
        const isActive = activeNav === id;

        return (
          <div
            key={id}
            className={`flex justify-center items-center flex-col md:w-full w-17 h-12 relative transition-all md:rounded-md 
              ${isActive 
                ? `bg-[#8B5CF6] md:text-violet-700 md:bg-violet-100 md:border-r-4 md:border-violet-700 
                  ${window.innerWidth < 768 ? 'button-animation' : ''}` 
                : "bg-transparent md:border-r-4 md:border-r-transparent"
              }`}
            onClick={() => handleNavClick(id)}
          >
            <div className="z-1 flex flex-col md:flex-row md:px-2 md:gap-2 md:py-2 justify-center md:justify-start w-full items-center -translate-y-1.5 md:translate-y-0">
              <i className={`bx ${icon} text-3xl md:text-2xl`}></i>
              <p className="text-sm font-bold md:text-md">{label}</p>
            </div>
            
            {/* Mobile-only background bubble - keeps button-animation ONLY if active */}
            <div
              className={`absolute md:hidden -top-1/2 w-full h-full z-0 rounded-full transition-all 
                ${isActive ? "bg-[#8B5CF6] button-animation" : "bg-transparent"}`}
            ></div>
          </div>
        );
      })}
    </nav>
  );
}
