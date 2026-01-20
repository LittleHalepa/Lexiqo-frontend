import BookMark from '../UI/BookmarkAnimation';
import { useUser } from '../../contexts/userContext';
import { useEffect, useState } from 'react';
import { sendRequest } from '../../utils/ApiUtils';
import AstronautAnimation from '../UI/Astronaut.tsx';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const [collections, setCollections] = useState<Array<{
    id: number;
    user_id: number;
    name: string;
    description: string;
    card_count: number;
    created_at: string;
    updated_at: string;
    bookmarked: boolean;
    color: string;
  }>>([]);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useUser();

  const colorMap: Record<string, string> = {
    '[#641ae6]': 'border-[#641ae6]',
    'yellow-500': 'border-yellow-500',
    'pink-500': 'border-pink-500',
    'red-500': 'border-red-500',
    'orange-500': 'border-orange-500',
    'green-500': 'border-green-500',
    'blue-500': 'border-blue-500',
    'black': 'border-gray-800',
  };

  useEffect(() => {
    sendRequest(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/get-collections`, 'GET')
      .then((data) => {
        if (!data || data.error) {
          setCollections([]);
          console.error(data ? data.message : 'Failed to fetch collections');
          return;
        }

        const sortedData = data.data.sort((a: any, b: any) => {
          if (a.bookmarked === b.bookmarked) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.bookmarked ? -1 : 1;
        });

        setCollections(sortedData);
      })
      .finally(() => setIsLoading(false)); 
  }, []);

  const handleBookmark = (collectionId: number, newState: boolean) => {  
    sendRequest(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/bookmark-collection`, 'POST', {
      collectionId,
      bookmark: newState,
    })
      .then((data) => {
        if (!data || data.error) {
          console.error(data ? data.message : 'Failed to update bookmark status');
          return;
        }
        setCollections((prevCollections) =>
          prevCollections.map((collection) =>
            collection.id === collectionId
              ? { ...collection, bookmarked: newState }
              : collection
          )
        );
        console.log('Bookmark status updated successfully');
      })
      .catch((error) => {
        console.error('Error updating bookmark status:', error);
      });
  }

  const handleSelectFilter = (filter: string) => {
    let sortedCollections = [...collections];
    switch (filter) {
      case 'most-recent':
        sortedCollections.sort((a, b) => {
          if (a.bookmarked && b.bookmarked) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          } else if (a.bookmarked && !b.bookmarked) {
            return -1;
          } else if (!a.bookmarked && b.bookmarked) {
            return 1;
          } else {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
        });
        break;
      case 'least-recent':
        sortedCollections.sort((a, b) => {
          if (a.bookmarked && b.bookmarked) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          } else if (a.bookmarked && !b.bookmarked) {
            return -1;
          } else if (!a.bookmarked && b.bookmarked) {
            return 1;
          } else {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          }
        });
        break;
      case 'most-cards':
        sortedCollections.sort((a, b) => {
          if (a.bookmarked && b.bookmarked) {
            return b.card_count - a.card_count;
          } else if (a.bookmarked && !b.bookmarked) {
            return -1;
          } else if (!a.bookmarked && b.bookmarked) {
            return 1;
          } else {
            return b.card_count - a.card_count;
          }
        });
        break;
      case 'least-cards':
        sortedCollections.sort((a, b) => {
          if (a.bookmarked && b.bookmarked) {
            return a.card_count - b.card_count;
          } else if (a.bookmarked && !b.bookmarked) {
            return -1;
          } else if (!a.bookmarked && b.bookmarked) {
            return 1;
          } else {
            return a.card_count - b.card_count;
          }
        }); 
        break;
      default:
        break;
    }
    setCollections(sortedCollections);
  }

  const handleCollectionClick = async (event: React.MouseEvent, idex: number) => {

    const collection = collections[idex];

    sendRequest(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/add-to-recent-collections`, 'POST', {
      collectionId: collection.id,
    }).catch((error) => {
      console.error('Error adding to recent collections:', error);
    });

    navigate(`/user/${user?.public_id}/dashboard/collection/${collection.id}`, { state: { collection: collection } });

  }

  const numberOfSkeletons = 4;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        
        {Array.from({ length: numberOfSkeletons }).map((_, index) => (
          <div key={index} className="flex flex-col h-full gap-3 p-3 m-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-gray-200 animate-pulse"></div>
                  <div className="w-50 h-6 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="h-7 w-5 rounded-md bg-gray-200 animate-pulse"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="mt-2 h-12 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="w-20 h-5 bg-gray-200 rounded-md animate-pulse"></div>
              </div>

              <div className="mt-auto border-t pt-3 border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-30 h-5 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="w-20 h-5 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
          </div>
        ))}

      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="flex justify-center flex-col gap-3 items-center min-h-[70vh]">
        <AstronautAnimation size={250} />
        <p className="text-gray-500">No collections found</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="col-span-full flex justify-end px-3 py-2">
        <select name="filter-options" id="filter-options" className="text-sm p-2" onChange={(event) => handleSelectFilter(event?.target.value)}>
          <option value="most-recent" className="text-sm ">Most Recent</option>
          <option value="least-recent" className="text-sm ">Least Recent</option>
          <option value="most-cards" className="text-sm ">Most Cards</option>
          <option value="least-cards" className="text-sm ">Least Cards</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 p-3 items-stretch lg:grid-cols-3 xl:grid-cols-4">


        {collections.map((collection, index) => (
          <div
            key={index}
            className={`flex flex-col h-full gap-3 p-3 border border-t-15 ${colorMap[collection.color] ?? 'border-brand'} rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 z-1`}
            onClick={(e) => handleCollectionClick(e, index)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-100 text-brand flex items-center justify-center">
                  <i className="bx bxs-collection text-2xl"></i>
                </div>
                <h2 className="font-semibold">{collection.name}</h2>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <BookMark 
                  bookmarked={collection.bookmarked} 
                  onToggle={() => handleBookmark(collection.id, !collection.bookmarked)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-5 min-h-[40px]">
                {collection.description}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                &#8226; {collection.card_count} cards
              </p>
            </div>

            <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <img
                  src="/avatars/default.png"
                  alt="profile picture"
                  width={30}
                  className="rounded-full"
                />
                <p className="text-sm font-medium text-black">
                  {user ? user.username : 'Guest'}
                </p>
              </div>
              <p className="text-sm">
                {collection.created_at.slice(0, 10).replace(/-/g, '.')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
