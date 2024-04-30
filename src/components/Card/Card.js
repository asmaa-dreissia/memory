import React from 'react';
import './Card.css'; // Importation du fichier CSS pour styliser le composant

const Card = ({ id, image, flipped, matched, onClick }) => {
  return (
    <div
      className={`card ${flipped || matched ? 'flipped' : ''}`}
      onClick={() => onClick(id)}
    >
      <div className="card-inner">
        <div className="card-front"></div>
        <div className="card-back">
          <img src={image} alt="Card" />
        </div>
      </div>
    </div>
  );
};

export default Card;
