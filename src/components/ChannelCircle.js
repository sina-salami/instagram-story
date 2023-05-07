import React from 'react';

export const ChannelCircle = ({ cover, onClick }) => {
  return <img className="channel-circle" src={cover} onClick={onClick} />;
};
