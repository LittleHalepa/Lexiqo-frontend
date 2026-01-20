import { useNavigate } from "react-router-dom"
import FireAnimatedIcon from "../UI/FireAnimation";
import { useUser } from "../../contexts/userContext";
import { useEffect, useState } from "react";
import { sendRequest } from "../../utils/ApiUtils";
import Bookmark from "../UI/BookmarkAnimation";

const Home = () => {

  const [recentCollections, setRecentCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    navigate("/");
  }

  useEffect(() => {
    setIsLoading(true);
    sendRequest(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/get-recent-collections`, 'GET')
      .then((response) => {
        if (!response.error) {
          setRecentCollections(response.data);
        } else {
          console.error('Error fetching recent collections:', response.message);
        }
      })
      .catch((error) => {
        console.error('Network error fetching recent collections:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleRecentCollectionClick = (collectionId: number) => {

    sendRequest(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/add-to-recent-collections`, 'POST', {
      collectionId: collectionId,
    }).catch((error) => {
      console.error('Error adding to recent collections:', error);
    });
    
    navigate(`/user/${user?.public_id}/dashboard/collection/${collectionId}`);
  }

  const skeletLenth = 5;

  return (
    <div className="p-3 flex flex-col gap-6 m-auto">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold">Recent</h2>
        </div>
        <div className="">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(skeletLenth)].map((_, index) => (
                <div key={index} className="w-full h-15 bg-gray-200 rounded-md animate-pulse flex items-center justify-between"> 
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-md ml-2"></div>
                    <div className="flex flex-col items-start justify-center">
                      <div className="h-4 w-42 bg-gray-300 rounded-md ml-4"></div>
                      <div className="h-3 w-20 bg-gray-300 rounded-md ml-4 mt-2"></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <div className="bg-gray-300 rounded-md h-6 w-5 mr-1"></div>
                    <div className="bg-gray-300 rounded-md h-3 w-15 mr-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentCollections.length === 0 ? (
            <div className="w-full p-8 text-center border border-gray-200 rounded-md bg-gray-50">
              <i className="bx bx-collection text-gray-400 text-4xl mb-2"></i>
              <p className="text-gray-500 font-medium">No recent collections</p>
              <p className="text-sm text-gray-400 mt-1">Your recently accessed collections will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentCollections.map((collection: any) => (
                <div className="flex w-full justify-between items-center p-2 border border-gray-200 rounded-md hover:shadow-xs cursor-pointer transition-all" key={collection.id} onClick={() => handleRecentCollectionClick(collection.collection_id)}>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-md p-2 flex items-center justify-center">
                      <i className="bx bxs-collection text-brand text-2xl"></i>
                    </div>
                    <div className="flex flex-col justify-center align-start">
                      <h3 className="font-semibold text-md">{collection.name}</h3>
                      <p className="text-sm text-gray-500">Author: <span className="font-medium">{user?.username}</span> · {collection.card_count} cards</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Bookmark bookmarked={collection.bookmarked} />
                    <p className="text-xs text-gray-500">{collection.last_opened.slice(0, 10).replace(/-/g, '.')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div id="days-streak" className="bg-[rgb(255,255,255)] day-streak-gradient py-3 px-2 rounded-md flex items-center gap-4 border border-[rgb(230,230,230)]">
        <div className="flex justify-between w-full items-center py-3">
          <div className="flex items-center">
            <div className="fire-background rounded-full flex items-center justify-center">
              <FireAnimatedIcon size={60} />
            </div>
            <div className="flex flex-col ml-4 h-full justify-center">
              <h3 className="text-fire font-bold text-xl">0 Days</h3>
              <p className="text-sm font-medium text-gray-500">Current streak</p>
            </div>
          </div>
          <div>
            <div className="shadow-sm rounded-md px-3 py-1 mt-2">
              <p className="text-sm text-brand font-medium">Best: 14 days</p>
            </div>
          </div>
        </div>
      </div>
      <div id="news" className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">News</h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <iframe className="w-full h-55 sm:h-60 md:h-65 rounded-md" src="https://www.youtube.com/embed/IpeJjQDXNAE?si=2854ItSsYb6IQFLf" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          <div className="h-55 sm:h-60 md:h-65 w-full flex gap-1 flex-col justify-center items-center rounded-md bg-[#8B5CF6] text-white">
            <h3 className="font-bold text-4xl">Lexiqo Plus</h3>
            <p className="font-medium text-sm">The most officiant way of studying!</p>

            <button
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white text-[#8B5CF6] text-sm font-semibold rounded-md shadow-md hover:shadow-xl transition-all"
              aria-label="Upgrade to Premium"
              onClick={() => navigate(`/user/${user?.public_id}/premium`)}
            >
              <i className="bx bx-star text-lg" />
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home