import { useState } from "react";
import CreditCard from "./components/CreditCard";
import CardForm from "./components/CardForm";
import type { CardData } from "./types/card";

function App() {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black 
flex flex-col items-center justify-center gap-12">
      <div className="relative w-[380px] h-[240px]">
        <CreditCard cardData={cardData} isFlipped={isFlipped} />
      </div>
      <div className="w-full max-w-[400px]">
        <CardForm
          cardData={cardData}
          setCardData={setCardData}
          setIsFlipped={setIsFlipped}
        />
      </div>
    </div>
  );
}

export default App;
