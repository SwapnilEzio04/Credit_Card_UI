import type React from "react";
import type { CardData } from "../types/card";
import { useState } from "react";

interface Props {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

function CardForm({ cardData, setCardData, setIsFlipped }: Props) {
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) =>
    (currentYear + i).toString().slice(-2),
  );

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

  // 1. Tracks when a user clicks out of an input
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // 2. Real-time error checker
  const getErrors = () => {
    const errors = { cardNumber: "", cardName: "", cvv: "", expiry: "" };

    if (!cardData.cardName.trim())
      errors.cardName = "Cardholder name is required.";

    const rawNum = cardData.cardNumber.replace(/\s/g, "");
    if (!rawNum) {
      errors.cardNumber = "Card number is required.";
    } else if (rawNum.length !== 16)
      errors.cardNumber = "Card number must be exactly 16 digits.";

    if (!cardData.cvv) {
      errors.cvv = "CVV is required.";
    } else if (cardData.cvv.length !== 3) errors.cvv = "CVV must be 3 digits.";

    if (!cardData.expiryMonth || !cardData.expiryYear)
      errors.expiry = "Month and year required.";

    return errors;
  };

  const errors = getErrors();
  // Form is valid ONLY if all error strings are empty
  const isFormValid = Object.values(errors).every((err) => err === "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const rawValue = value.replace(/\D/g, "");
      const formattedValue = rawValue.replace(/(\d{4})(?=\d)/g, "$1 ").trim();

      if (formattedValue.length <= 19) {
        setCardData((prev) => ({ ...prev, [name]: formattedValue }));
      }

      return;
    }

    if (name === "cvv") {
      const numbersOnly = value.replace(/\D/g, "");

      setCardData((prev) => ({ ...prev, [name]: numbersOnly }));
      return;
    }

    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      setTouched({
        cardNumber: true,
        cardName: true,
        cvv: true,
        expiryMonth: true,
        expiryYear: true,
      });
      setSubmitMessage({
        type: "error",
        text: "❌ Please fill out all fields correctly before submitting. ",
      });

      return;
    }

    try {
      const response = await fetch(
        "https://credit-card-api-ignq.onrender.com/save-card",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Show green success message
        setSubmitMessage({ type: "success", text: "🎉 " + data.message });
        // Clear the form and errors
        setCardData({
          cardNumber: "",
          cardName: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
        });
        setTouched({});
      } else {
        // Show red error message from Python
        setSubmitMessage({
          type: "error",
          text: "❌ " + (data.detail || "Failed to save card."),
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "⚠️ Could not connect to the backend. Is Python running?",
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-95 bg-gray-800 text-white p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
      <div className="flex flex-col">
        <input
          type="text"
          name="cardNumber"
          value={cardData.cardNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Card Number"
          maxLength={19}
          className="bg-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2 rounded-md"
        />
        {touched.cardNumber && errors.cardNumber && (
          <span className="text-red-400 text-xs mt-1 ml-1">
            {errors.cardNumber}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <input
          type="text"
          name="cardName"
          value={cardData.cardName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Card Holder Name"
          className="bg-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2 rounded-md"
        />
        {touched.cardName && errors.cardName && (
          <span className="text-red-400 text-xs mt-1 ml-1">
            {errors.cardName}
          </span>
        )}
      </div>
      {/* EXPIRY FIELDS */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-4">
          <select
            name="expiryMonth"
            value={cardData.expiryMonth}
            onChange={handleChange}
            onBlur={handleBlur} // <--- ADDED THIS
            className="w-1/2 bg-gray-700 border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 rounded-md p-3 text-white transition-all">
            <option value="" disabled>
              Month
            </option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            name="expiryYear"
            value={cardData.expiryYear}
            onChange={handleChange}
            onBlur={handleBlur} // <--- ADDED THIS
            className="w-1/2 bg-gray-700 border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 rounded-md p-3 text-white transition-all">
            <option value="" disabled>
              Year
            </option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* ADD THIS: The Expiry Error Span */}
        {(touched.expiryMonth || touched.expiryYear) && errors.expiry && (
          <span className="text-red-400 text-xs ml-1">{errors.expiry}</span>
        )}
      </div>

      <div className="flex flex-col">
        <input
          type="text"
          name="cvv"
          value={cardData.cvv}
          onChange={handleChange}
          onFocus={() => setIsFlipped(true)}
          onBlur={(e) => {
            setIsFlipped(false);
            handleBlur(e);
          }}
          placeholder="CVV"
          maxLength={3}
          className="bg-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2 rounded-md"
        />
        {touched.cvv && errors.cvv && (
          <span className="text-red-400 text-xs mt-1 ml-1">{errors.cvv}</span>
        )}
      </div>
      <button
        type="submit"
        className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-md transition-colors">
        Save Card Securely
      </button>
      {submitMessage.text && (
        <div
          className={`mt-2 p-3 rounded-md text-sm text-center font-medium animate-pop ${
            submitMessage.type === "success"
              ? "bg-green-500/20 text-green-400 border border-green-500/50"
              : "bg-red-500/20 text-red-400 border border-red-500/50"
          }`}>
          {submitMessage.text}
        </div>
      )}
    </form>
  );
}

export default CardForm;
