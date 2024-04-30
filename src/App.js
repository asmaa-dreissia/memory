import React, { useState, useEffect } from 'react';
import './App.css';
import Title from './components/Title/title';
import Button from './components/Button/Button';
import Card from './components/Card/Card';

const cardImages = [
  '/images/image1.png',
  '/images/image2.jpg',
  '/images/image3.jpg',
  '/images/image4.jpg',
  '/images/image5.jpg',
  '/images/image6.jpg',
  '/images/image7.jpg',
  '/images/image8.jpg',
  '/images/image9.jpg',
  '/images/image10.jpg',
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [victory, setVictory] = useState(false);

  // Fonction pour initialiser les cartes
  const initializeCards = () => {
    const shuffledImages = [...cardImages, ...cardImages].sort(() => Math.random() - 0.5);
    const initialCards = shuffledImages.map((image, index) => ({
      id: index,
      image,
      flipped: false,
      matched: false,
    }));
    setCards(initialCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setVictory(false);
  };

  // Effet pour vérifier si toutes les cartes ont été retournées
  useEffect(() => {
    if (matchedCards.length === cardImages.length) {
      setVictory(true);
    }
  }, [matchedCards]);

  // Fonction pour retourner une carte
  const flipCard = (id) => {
    if (flippedCards.length === 2) {
      return;
    }
    const newCards = cards.map((card) =>
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);
  };

  // Effet pour vérifier si les cartes retournées correspondent
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      const newCards = cards.map((card) =>
        card.id === firstCard || card.id === secondCard
          ? { ...card, matched: true }
          : card
      );
      setCards(newCards);
      setMatchedCards([...matchedCards, firstCard, secondCard]);
      setFlippedCards([]);
    }
  }, [flippedCards]);

  // Effet pour retourner les cartes après un court délai
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newCards = cards.map((card) =>
        flippedCards.includes(card.id) ? { ...card, flipped: false } : card
      );
      setCards(newCards);
      setFlippedCards([]);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [flippedCards]);

    // Génération des cartes
  const renderCards = () => {
    return cardImages.slice(0, 10).map((image, index) => (
      <Card
        key={index}
        id={index}
        image={image}
        flipped={flippedCards.includes(index) || matchedCards.includes(index)}
        matched={matchedCards.includes(index)}
        onClick={() => flipCard(index)}
      />
    ));
  };


  return (
    <div className="App">
      <Title />
      <div className="board">{renderCards()}</div>
      {victory && <div className="message">Félicitations ! Vous avez gagné !</div>}
      <Button onClick={initializeCards}>Nouvelle partie</Button>
    </div>
  );
}

export default App;
