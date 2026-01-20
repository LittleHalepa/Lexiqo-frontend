import { useEffect, useState } from "react";

type FlashcardsProps = {
    cards: Array<{
        id: number,
        collection_id: number,
        term: string,
        definition: string,
        image: string | null,
        created_at: string,
        updated_at: string
    }>,
    height?: string,
    index?: number,
    setIndex?: (index: number) => void
}

export const Flashcards = ({cards, height, index, setIndex} : FlashcardsProps) => {

    if (cards.length === 0) {
        return (
            <div className="p-3 text-center">
                <p className="text-gray-500">No flashcards available in this collection.</p>
            </div>
        );
    }

    if (index === undefined || setIndex === undefined) {
        index = 0;
        setIndex = () => {};
    }

    useEffect(() => {
        console.log(cards);
    }, []);

    const [isFlipped, setIsFlipped] = useState(false);

    const handleRotateCard = () => {
        setIsFlipped(!isFlipped);
    }

    return (
        <div className="px-4 md:px-0">
            <div className="flex items-center justify-center">
                <div className="w-full">
                    <div 
                    className="relative cursor-pointer "
                    onClick={handleRotateCard}
                    style={{ perspective: '1000px', height: height || '256px', transformStyle: 'preserve-3d' }}
                    >
                    <div
                        className="absolute w-full h-full transition-transform duration-600"
                        style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                    >
                        {/* Front Side */}
                        <div
                        className="absolute w-full h-full bg-white rounded-xl shadow-lg p-8 flex items-center justify-center border border-gray-400"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                        }}
                        >
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-gray-800">{cards[index].term}</p>
                        </div>
                        </div>

                        {/* Back Side */}
                        <div
                        className="absolute w-full h-full bg-brand rounded-xl shadow-lg p-8 flex items-center justify-center"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                        >
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-white">{cards[index].definition}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-3 px-4">
                <button className="text-3xl text-black cursor-pointer p-2 rounded-full font-medium transition-all" onClick={() => { if (index !== 0) {
                    setIndex(index - 1);
                    setIsFlipped(false);
                }}}><i className='bx bx-left-arrow-alt'></i></button>
                <p className="text-center text-sm text-gray-500">Card {index + 1} of {cards.length}</p>
                <button className="text-3xl text-black cursor-pointer p-2 rounded-full font-medium transition-all" onClick={() => { if (index !== cards.length - 1){
                    setIndex(index + 1);
                    setIsFlipped(false);
                }}}><i className='bx bx-right-arrow-alt' ></i></button>
            </div>
        </div>    
    );
}