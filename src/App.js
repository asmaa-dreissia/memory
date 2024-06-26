import React, { useState, useEffect } from 'react';
import './App.css';
import Title from './components/Title/title';
import Button from './components/Button/Button';
import Card from './components/Card/Card';

const cardImages = [
  require('../src/images/stitche.jpg'),
  require('../src/images/stitche.jpg'),
  require('../src/images/angel.jpg'),
  require('../src/images/angel.jpg'),
  require('../src/images/leroy.jpg'),
  require('../src/images/leroy.jpg'),
  require('../src/images/marvel.jpg'),
  require('../src/images/marvel.jpg'),
  require('../src/images/lilo.jpg'),
  require('../src/images/lilo.jpg'),
];

// Fonction pour mélanger un tableau
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [victory, setVictory] = useState(false);
  const [showDefeatMessage, setShowDefeatMessage] = useState(false); // État pour afficher le message de défaite
  const [timeLeft, setTimeLeft] = useState(60); // Temps initial en secondes

  // Effet pour initialiser les cartes
  useEffect(() => {
    initializeCards();
    startTimer();
  }, []);

  // Fonction pour démarrer le minuteur
  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          setShowDefeatMessage(true); // Affiche le message de défaite
          return 0; // Arrête le minuteur à 0
        }
      });
    }, 1000); // Met à jour le temps toutes les secondes
  };
  
  
  // Fonction pour initialiser les cartes et redémarrer le chrono
  const initializeCards = () => {
    const shuffledImages = shuffleArray([...cardImages]); // Ne mélangez qu'une seule fois les images de cartes
    const initialCards = shuffledImages.map((image, index) => ({
      id: index,
      image,
      flipped: false,
      matched: false,
    })).slice(0, 10); // Ne prenez que les 10 premières cartes
    setCards(initialCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setVictory(false);
    setShowDefeatMessage(false); // Réinitialise le message de défaite
    setTimeLeft(90); // Réinitialise le temps restant
    startTimer(); // Redémarre le minuteur
  };

  // Effet pour vérifier si toutes les cartes ont été retournées
  useEffect(() => {
    if (matchedCards.length === cardImages.length) {
      setVictory(true);
    }
  }, [matchedCards]);

    // Fonction pour retourner une carte
  const flipCard = (id) => {
    // Vérifier si le temps est écoulé
    if (timeLeft === 0) {
      return;
    }
    
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
      if (cards[firstCard].image === cards[secondCard].image) {
        // Si les deux cartes sont identiques, marquez-les comme correspondantes
        const newMatchedCards = [...matchedCards, firstCard, secondCard];
        setMatchedCards(newMatchedCards);
      } else {
        // Si les deux cartes ne sont pas identiques, retournez-les après un court délai
        const timeout = setTimeout(() => {
          const newCards = cards.map((card) =>
            flippedCards.includes(card.id) ? { ...card, flipped: false } : card
          );
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
        return () => clearTimeout(timeout);
      }
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
    }, 2000);
    return () => clearTimeout(timeout);
  }, [flippedCards]);

  // Génération des cartes
  const renderCards = () => {
    return cards.map((card) => (
      <Card
        key={card.id}
        id={card.id}
        image={card.image}
        flipped={flippedCards.includes(card.id) || matchedCards.includes(card.id)}
        matched={matchedCards.includes(card.id)}
        onClick={() => flipCard(card.id)}
      />
    ));
  };

  // Gestion du mélange des cartes
  const handleShuffle = () => {
    const shuffledCards = shuffleArray(cards);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setVictory(false);
    setShowDefeatMessage(false); // Réinitialise le message de défaite
    setTimeLeft(60); // Réinitialise le temps restant
    startTimer(); // Redémarre le minuteur
  };

  return (
    <div className="App">
      <Title />
      <div className="timer">{timeLeft} secondes restantes</div>
      <div className="board">{renderCards()}</div>
      {victory && <div className="messageF">Félicitations ! Vous avez gagné !</div>}
      {showDefeatMessage && <div className="messageG">Désolé, vous avez perdu !</div>}
      <Button onClick={initializeCards}>Nouvelle partie</Button>
      <Button onClick={handleShuffle}>Mélanger</Button>
    </div>
  );
}

export default App;
  