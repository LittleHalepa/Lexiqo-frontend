import { useRef } from "react";
import SearchAnimatedIcon from "./SearchAnimatedIcon";
import type { SearchAnimatedIconRef } from "./SearchAnimatedIcon";

const QuickSearchInput = () => {
  const searchRef = useRef<SearchAnimatedIconRef>(null);

  const handleClick = () => {
    searchRef.current?.playAnimation();
  };

  return (
    <div className="w-full fixed top-14 md:w-50 flex justify-center items-center px-2.5 mb-2">
        <input type="text" id="quick-search" className="w-full bg-white border-gray-400 border py-1.5 text-sm font-semibold px-3 pl-9 caret-transparent outline-none rounded-sm focus:border-[rgb(100,26,230)] focus:ring-1 focus:ring-[rgb(100,26,230)] transition duration-200" onClick={handleClick}/>
        <label htmlFor="quick-search"><SearchAnimatedIcon ref={searchRef} size={30}/></label>
    </div>
  );
};

export default QuickSearchInput;