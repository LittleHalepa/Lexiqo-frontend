import { useState } from "react";
import { sendRequest } from "../../utils/ApiUtils";
import Message from "../UI/Message";

type FlashcardsProps = {
    cards: Array<{
        id: number,
        collection_id: number,
        term: string,
        definition: string,
        image: string | null,
        created_at: string,
        undated_at: string
    }>;
}

const AddCollection = () => {

  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{status: 'success' | 'error' | 'info', text: string, device: 'desktop' | 'mobile'} | null>(null);
  const [flashcards, setFlashcards] = useState<Array<{term: string, definition: string}>>([
    {term: "", definition: ""},
  ]);

  const [focusStates, setFocusStates] = useState<{ term: boolean[]; def: boolean[] }>({
    term: flashcards.map(() => false),
    def: flashcards.map(() => false),
  });

  const [selectedColor, setSelectedColor] = useState<string>('bg-brand');

  const colors = [
    'bg-brand',
    'bg-red-500',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-pink-500',
    'bg-black'
  ];

  const handleFocus = (type: "term" | "def", idx: number, val: boolean) => {
    setFocusStates((prev) => ({
      ...prev,
      [type]: prev[type].map((f, i) => (i === idx ? val : f)),
    }));
  };

  const handleInputChange = (
    idx: number,
    type: "term" | "definition",
    value: string
  ) => {

    

    setFlashcards((prev) =>
      prev.map((fc, i) =>
        i === idx ? { ...fc, [type]: value } : fc
      )
    );
  };

  const handleDeleteCard = (index: number) => {
    setFlashcards(prev => prev.filter((_, i) => i !== index));

    setFocusStates(prev => ({
      term: prev.term.filter((_, i) => i !== index),
      def: prev.def.filter((_, i) => i !== index),
    }));
  };

  const handleShowColorPicker = () => {
    const picker = document.querySelector('#picker') as HTMLElement;
    const closeArea = document.querySelector('#close-area') as HTMLElement;

    closeArea.onclick = () => {
      picker.classList.add('hidden');
      picker.classList.remove('grid', 'grid-cols-4');
      closeArea.classList.remove('block');
      closeArea.classList.add('hidden');
    }

    if (picker.classList.contains('hidden')) {
      picker.classList.remove('hidden');
      picker.classList.add('grid', 'grid-cols-4');
      closeArea.classList.remove('hidden');
      closeArea.classList.add('block');
    }
  }

  const handleSelectColor = (event: any, color: string) => {
    const target = event.target as HTMLElement;
    const colorsOptions = document.querySelectorAll('#color-option');

    colorsOptions.forEach((option) => {
      option.classList.remove('scale-80');
    });

    target.classList.add('scale-80');

    setSelectedColor(color);
  }

  const handleAddCard = () => {
    setFlashcards((prev) => [...prev, { term: "", definition: "" }]);
    setFocusStates((prev) => ({
      term: [...prev.term, false],
      def: [...prev.def, false],
    }));

    setTimeout(() => {
      const newCard = document.getElementById(`card-${flashcards.length}`);
      newCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  const addNextCard = (event: any) => {
    const target = event.target as HTMLElement;
    const cardElement = target.closest('.flashcard');
    
    if (cardElement) {
      const index = Array.from(cardElement.parentElement?.children || []).indexOf(cardElement);
      
      if (index === flashcards.length - 1) {
        handleAddCard();
      } else {

        setFlashcards((prev) => [
          ...prev.slice(0, index + 1),
          { term: "", definition: "" },
          ...prev.slice(index + 1),
        ]);
      }
    }
  }

  const handleCreateCollection = () => {

    if (isCreating) return;
    setIsCreating(true);

    if (flashcards.length === 0) {
      setIsCreating(false);
      setMessage({status: "error", text: "Please add at least one flashcard.", device: 'mobile'});
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      return;
    }

    const body = {
      name: (document.getElementById("title") as HTMLInputElement).value,
      description: (document.getElementById("description") as HTMLInputElement).value,
      collectionData: flashcards,
      color: selectedColor.replace('bg-', ''),
    }

    sendRequest(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/create-collection`, 'POST', body).then((data) => {
      if (data.error) {
        setIsCreating(false);
        setMessage({status: "error", text: data.message || "An error occurred while creating the collection.", device: 'mobile'});
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      } else if (!data.error) {
        setMessage({status: "success", text: "Success", device: 'mobile'});

        setTimeout(() => {
          setMessage(null);
        }, 3000);

        (document.getElementById("title") as HTMLInputElement).value = '';
        (document.getElementById("description") as HTMLInputElement).value = '';
        setIsCreating(false);
        setFlashcards([]);
      } else {
        setIsCreating(false);
        setMessage({status: "error", text: "An error occurred while creating the collection.", device: 'mobile'});
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    });
  }

  return (
    <div className="p-3 w-full flex flex-col gap-8 relative max-w-7xl m-auto">
      {message && (
        <div 
          id="message-element" 
          className={`fixed top-26 transition-all animate-slide-down animate-slide-in
            ${message.device === 'mobile' ? 'left-[0.5rem] right-[0.5rem]' : 'w-auto'}
            z-50`}
        >
          <Message status={message.status} text={message.text}/>
        </div>
      )}
      <div>
        <div className="w-full flex flex-col gap-4 z-5">
          <div className="flex flex-col z-5">
            <label htmlFor="title" className="font-semibold text-sm md:text-base translate-y-0.5">Title</label>
            <input type="text" id="title" className="bg-white shadow-sm py-1.5 px-3 text-sm font-medium border-2 border-gray-200 outline-none rounded-md focus:border-[rgb(100,26,230)] transition-all" placeholder="Enter collection title"/>
          </div>
          <div className="flex flex-col z-5">
            <label htmlFor="description" className="font-semibold text-sm md:text-base translate-y-0.5">Description</label>
            <textarea id="description" className="bg-white shadow-sm py-1.5 px-3 text-sm font-medium border-2 border-gray-200 outline-none rounded-md focus:border-[rgb(100,26,230)] transition-all w-full h-32 resize-none" placeholder="Enter collection description"></textarea>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row gap-3 relative">
        <p className="font-semibold md:text-base cursor-pointer whitespace-nowrap text-sm mb-2" onClick={handleShowColorPicker}>Select color:</p>
        <div className={`${selectedColor} h-4 cursor-pointer translate-y-0.5 rounded-lg md:w-80 w-full`} onClick={handleShowColorPicker}></div>

        <div id="picker" className="absolute left-25 top-1/1 gap-4 px-5 py-2 bg-gray-50 hidden rounded-md shadow-md z-15">
          {colors.map((color) => (
            <div 
              key={color}
              id="color-option"
              className={`${color} w-8 h-8 rounded-lg cursor-pointer border-2 border-white hover:border-gray-300 transition-all ${color === 'bg-brand' ? 'scale-80' : ''}`}
              onClick={() => handleSelectColor(event ,color)}
            ></div>
          ))}
        </div>
      </div>  

      <div id="close-area" className="absolute right-0 top-0 w-full h-full z-10 hidden"></div>

      <hr className="text-gray-300" />
      <div className=""> 
        <div className="w-full flex items-center justify-between z-5">
          <p className="font-semibold md:text-base text-sm">Flashcards</p>
          <div className="flex items-center gap-3">
            <div className="bg-white shadow-sm relative p-4 rounded-md"><i className='bx bx-transfer-alt text-2xl absolute top-1 left-1'></i></div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 z-5">
          {flashcards.length === 0 ? (
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center gap-3">
              <i className='bx bx-book-open text-4xl text-gray-400'></i>
              <p className="text-gray-400 text-sm">No flashcards added yet</p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4 z-5">
                {flashcards.map((flashcard, index) => (
                  <div key={index} id={`card-${index}`} className="w-full flex flex-col items-center gap-5 md:gap-8 shadow-sm p-3 flashcard bg-white rounded-md appear-animation transition-all translate-y-0 z-5">
                    <div className="w-full flex items-center justify-between">
                      <p className="text-sm md:text-base font-bold text-gray-500">{index + 1}</p>
                      <div className="flex items-center">
                        <i className='bx bx-trash text-xl md:text-2xl text-gray-400 cursor-pointer active:text-red-500 transition-all' onClick={() => handleDeleteCard(index)}></i>
                        <i className='bx bx-image-add text-3xl text-gray-400 cursor-pointer ml-4 translate-y-0.5'></i>
                        <i className='bx bx-dots-vertical-rounded text-2xl text-gray-400  cursor-pointer ml-3'></i>
                      </div>
                    </div>
                    <div className=" w-full flex flex-col md:flex-row gap-4 x-5">
                      <div className="w-full flex flex-col gap-1 relative">
                        <input type="text" id={`term-${index}`} value={flashcard.term} onFocus={() => {handleFocus("term", index, true)}} onBlur={() => handleFocus("term", index, false)} onChange={(e) => handleInputChange(index, "term", e.target.value)}
                        className="bg-white shadow-sm py-1.5 px-3 text-sm md:text-base font-semibold border-2 border-gray-200 outline-none rounded-md focus:border-[rgb(100,26,230)] transition-all"/>
                        <label htmlFor={`term-${index}`} className={`text-sm md:text-base font-semibold text-gray-500 absolute left-3 transition-all duration-200
                          ${
                            focusStates.term[index] || flashcard.term.length > 0
                              ? "top-[-10px] bg-white px-1 text-xs md:text-sm"
                              : "top-2"
                          }
                        `}>Term</label>
                      </div>
                      <div className="w-full flex flex-col gap-1 relative">
                        <input type="text" id={`definition-${index}`} className="bg-white shadow-sm md:text-base py-1.5 px-3 text-sm font-semibold border-2 border-gray-200 outline-none rounded-md focus:border-[rgb(100,26,230)] transition-all" value={flashcard.definition} onFocus={() => handleFocus("def", index, true)} onBlur={() => handleFocus("def", index, false)} onChange={(e) => handleInputChange(index, "definition", e.target.value)}/>
                        <label htmlFor={`definition-${index}`} className={`text-sm md:text-base font-semibold text-gray-500 absolute left-3 transition-all duration-200
                          ${
                            focusStates.def[index] || flashcard.definition.length > 0
                              ? "top-[-10px] bg-white px-1 text-xs md:text-sm"
                              : "top-2"
                          }
                        `}>Definition</label>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-end">
                      <i className='bx bx-plus text-xl md:text-2xl text-gray-400 cursor-pointer' onClick={(event) => addNextCard(event)}></i>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center mt-6 gap-4 z-5">
          <div className="flex items-center justify-end w-full">
            <button className="text-white cursor-pointer bg-brand md:px-8 py-1.5 px-4 pr-4 rounded-md text-sm font-semibold flex justify-center items-center" onClick={handleAddCard}>Add</button>
          </div>
          <div className="flex flex-row gap-3 mt-6 items-center justify-center z-5">
            <button className={`text-sm text-black border cursor-pointer hover:bg-gray-100 border-[rgba(51,51,51,20%)] py-2 rounded-md px-5 font-semibold shadow-sm md:px-8 transition-all`}
            onClick={handleCreateCollection}>
                {isCreating ? (
                    <span className="inline-flex items-center gap-2">
                    <i className="bx bx-loader-alt bx-spin bx-rotate-90" />
                      <span>Creating...</span>
                    </span>
                  ) : 
                  "Create"
              }
            </button>
            <button className="flex-1 md:flex-0 whitespace-nowrap px-10 bg-brand text-white py-2 cursor-pointer rounded-md font-semibold text-sm border border-[rgb(100,26,230)]">Create and Learn</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCollection;
