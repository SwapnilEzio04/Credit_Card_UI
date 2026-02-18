import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
from fastapi import HTTPException

engine = create_engine("sqlite:///./cards.db",
                       connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class DBCard(Base):
    __tablename__ = "saved_cards"
    id = Column(Integer, primary_key=True)
    card_name = Column(String)
    masked_number = Column(String)
    expiry = Column(String)


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CardData(BaseModel):
    cardNumber: str
    cardName: str
    expiryMonth: str
    expiryYear: str
    cvv: str


@app.post("/save-card")
def save_card(card: CardData):
    if not card.cardName.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty.")

    raw_number = card.cardNumber.replace(" ", "")
    if len(raw_number) != 16 or not raw_number.isdigit():
        raise HTTPException(
            status_code=400, detail="Card number must be exactly 16 digits.")

    if len(card.cvv) != 3 or not card.cvv.isdigit():
        raise HTTPException(
            status_code=400, detail="CVV must be exactly 3 digits.")

    if not card.expiryMonth or not card.expiryYear:
        raise HTTPException(
            status_code=400, detail="Expiration month and year are required.")

    clean_name = card.cardName.title()
    last_four = raw_number[-4:]
    masked = f"#### #### #### {last_four}"

    db = SessionLocal()
    new_card = DBCard(
        card_name=clean_name,
        masked_number=masked,
        expiry=f"{card.expiryMonth}/{card.expiryYear}"
    )
    db.add(new_card)
    db.commit()
    db.close()

    return {"message": "Success! Card securely saved in database"}


@app.get("/cards")
async def get_cards():
    conn = sqlite3.connect('cards.db')
    # This line makes the data look like nice JSON (dictionaries) instead of just numbers
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Select everything from your table
    cursor.execute("SELECT * FROM credit_cards")
    cards = cursor.fetchall()

    conn.close()
    return cards
