import React from 'react';

export const Actions = ({ onNext, onPrev }) => {
  return (
    <div>
      <button onClick={onPrev}>onPrev</button>
      <button onClick={onNext}>onNext</button>
    </div>
  );
};
