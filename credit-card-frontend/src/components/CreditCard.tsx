import { useState } from "react";
import type { CardData } from "../types/card";

interface Props {
  cardData: CardData;
  isFlipped: boolean;
}

function CreditCard({ cardData, isFlipped }: Props) {
  const formatCardNumber = (num: string) => {
    if (!num) return "#### #### #### ####";

    const raw = num.replace(/\s/g, "");

    let result = "";

    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        result += " ";
      }
      if (raw[i]) {
        if (i >= 4 && i < 12) {
          result += "•";
        } else {
          result += raw[i];
        }
      } else {
        result += "#";
      }
    }

    return result;
  };

  const getCardType = (num: string) => {
    const cleanNum = num.replace(/\s/g, "");

    if (!cleanNum) return "UNKNOWN";

    if (cleanNum.startsWith("4")) return "VISA";
    if (cleanNum.startsWith("5")) return "MASTERCARD";
    if (cleanNum.startsWith("3")) return "AMEX";
    if (cleanNum.startsWith("6")) return "DISCOVER";

    return "UNKNOWN";
  };

  const renderCardLogo = (type: string) => {
    const commonClasses = "w-14 h-8 object-contain drop-shadow-md";

    switch (type) {
      case "VISA":
        return (
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/visa.svg"
            alt="Visa"
            className={`${commonClasses} brightness-0 invert`}
          />
        );
      case "MASTERCARD":
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className={commonClasses}
          />
        );
      case "AMEX":
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
            alt="Amex"
            className={commonClasses}
          />
        );
      case "DISCOVER":
        return (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg"
            alt="Discover"
            className={commonClasses}
          />
        );
      default:
        // Returns absolutely nothing if the type is "UNKNOWN"
        return null;
    }
  };
  // --- 1. THE LOGIC WIRES ---
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = (y - centerY) / 12; // Controls tilt intensity
    const rotateY = (centerX - x) / 12;
    setRotate({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => setRotate({ x: 0, y: 0 });

  // Add this logic to handle Touch (fingers)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    // Get the first finger's position
    const touch = e.touches[0];
    const x = touch.clientX - card.left;
    const y = touch.clientY - card.top;

    const centerX = card.width / 2;
    const centerY = card.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleTouchEnd = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="w-95 aspect-[1.586] perspective mx-auto mb-12">
      {/* 1. THE MAIN TILT CONTAINER (REPLACES YOUR OLD LINE 106) */}
      <div
        className="relative w-96 aspect-[1.586] mx-auto mb-12 transition-transform duration-200 ease-out cursor-pointer touch-action-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          perspective: "1000px",
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: "preserve-3d",
        }}>
        {/* 2. THE HOLOGRAM SHINE LAYER (THE "GLOSS" ON TOP) */}
        <div
          className="absolute inset-0 z-30 pointer-events-none rounded-xl opacity-20"
          style={{
            background: `radial-gradient(circle at ${rotate.y * -5 + 50}% ${rotate.x * 5 + 50}%, white 0%, transparent 60%)`,
          }}></div>

        {/* 3. YOUR EXISTING CARD INNER (YOUR OLD LINE 107) */}
        <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
          {/* FRONT */}
          {/* ================= FRONT OF CARD ================= */}
          <div className="card-face h-full w-full rounded-xl shadow-2xl overflow-hidden relative bg-linear-to-br from-indigo-600 via-purple-700 to-slate-900 border border-white/20 backface-hidden">
            {/* THE GLOSSY SHINE OVERLAY */}
            <div className="absolute inset-0 bg-linear-to-tr from-white/20 via-transparent to-white/5 pointer-events-none"></div>

            <div className="p-6 h-full flex flex-col justify-between relative z-10">
              {/* Top Row: Chip, Contactless, & Logo */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {/* 1. Realistic Gold Chip with lines */}
                  <div className="w-12 h-9 bg-linear-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-md shadow-[inset_0px_0px_4px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-evenly py-1">
                    <div className="w-full h-px bg-black/30"></div>
                    <div className="w-full h-px bg-black/30"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/30 transform -translate-x-1/2"></div>
                  </div>
                  {/* 2. Contactless SVG Icon */}
                  <svg
                    className="w-5 h-5 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                    />
                  </svg>
                </div>

                {/* Dynamic Logo (Keep your existing function here!) */}
                <div
                  key={getCardType(cardData.cardNumber)}
                  className="h-8 flex items-center justify-end w-20 animate-pop">
                  {renderCardLogo(getCardType(cardData.cardNumber))}
                </div>
              </div>

              {/* Bottom Row: Embossed Details */}
              <div className="text-white drop-shadow-md">
                <div
                  key={cardData.cardNumber}
                  className="text-lg md:text-2xl tracking-[0.1em] md:tracking-[0.15em] font-mono font-semibold mb-2 text-gray-100 animate-pop whitespace-nowrap">
                  {formatCardNumber(cardData.cardNumber) ||
                    "#### #### #### ####"}
                </div>
                <div className="flex justify-between text-xs tracking-wider opacity-90 uppercase">
                  <div className="flex flex-col">
                    <span className="text-[9px] opacity-70 mb-1">
                      Card Holder
                    </span>
                    <span
                      key={cardData.cardName}
                      className="truncate max-w-45 font-semibold tracking-widest animate-pop">
                      {cardData.cardName || "FULL NAME"}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] opacity-70 mb-1 uppercase">
                      Expires
                    </span>
                    <div className="font-semibold tracking-widest flex justify-end gap-1">
                      {/* MONTH: Only one source of truth here */}
                      <span
                        key={`month-${cardData.expiryMonth}`}
                        className="inline-block animate-pop min-w-[1.2rem]">
                        {cardData.expiryMonth || "MM"}
                      </span>

                      <span className="opacity-50">/</span>

                      {/* YEAR: Only one source of truth here */}
                      <span
                        key={`year-${cardData.expiryYear}`}
                        className="inline-block animate-pop min-w-[1.2rem]">
                        {cardData.expiryYear || "YY"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="card-face h-full w-full rounded-xl shadow-2xl overflow-hidden relative bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            {/* ^^^ Fixed the syntax above. Added brackets [] so Tailwind understands them. */}

            {/* Edge-to-Edge Magnetic Stripe */}
            <div className="w-full h-12 bg-black mt-6 shadow-inner opacity-90"></div>

            <div className="p-5 relative z-10 flex flex-col justify-between h-[calc(100%-4.5rem)]">
              {/* Signature Box & CVV */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="text-right pr-2 text-[10px] text-gray-300 font-semibold uppercase tracking-widest">
                  Authorized Signature
                </div>
                <div className="flex w-full h-10 items-center bg-gray-200 rounded-sm overflow-hidden shadow-inner">
                  {/* Textured Signature Area */}
                  <div className="flex-1 h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#d1d5db_2px,#d1d5db_4px)]"></div>
                  {/* CVV Box area */}
                  <div className="w-14 h-full bg-white flex items-center justify-center border-l border-gray-300">
                    <span className="text-black font-mono font-bold text-xl tracking-widest block translate-y-0.5">
                      {cardData.cvv ? cardData.cvv.replace(/./g, "•") : "•••"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Authentic Tiny Text */}
              <div className="text-center text-[10px] text-gray-400 mt-4 leading-tight font-medium">
                This card is non-transferable and must be returned upon request.
                <br />
                <span className="text-white">
                  Customer Service: 1-800-555-0199
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditCard;
