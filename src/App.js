import React, { useEffect, useState, useMemo } from 'react';
import './style.css';

import { ChannelCircle } from './components/ChannelCircle';
import { Actions } from './components/Actions';

export default function App() {
  const [channels, setChannels] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState('');
  const [activeStoryId, setActiveStoryId] = useState('');

  const activeChannel = useMemo(
    () =>
      activeChannelId
        ? channels.find((channel) => channel.id === activeChannelId)
        : null,
    [activeChannelId]
  );

  const activeStory = useMemo(() => {
    if (activeChannelId) {
      if (activeStoryId) {
        return activeChannel.stories.find(
          (story) => story.id === activeStoryId
        );
      } else {
        return activeChannel.stories[0];
      }
    }
    return null;
  });

  useEffect(() => {
    fetch('https://run.mocky.io/v3/df104ed2-8aa1-48e7-abc6-1df9bf64465c')
      .then((res) => res.json())
      .then((res) => {
        const data = res.channels.map((channel, i) => ({
          ...channel,
          index: i,
          stories: channel.stories.map((story, j) => ({
            ...story,
            index: j,
          })),
        }));
        setChannels(data);
      })
      .catch(console.error);
  }, []);

  const isIndexValid = (index, arr) => {
    return index >= 0 && index < arr.length;
  };

  const handleCircleClick = (id) => {
    setActiveChannelId(id);
  };

  const handleNextClick = () => {
    if (!activeChannelId) {
      return;
    }
    const nextActiveChannelIndex = activeChannel.index + 1;
    const nextActiveStoryIndex = activeStory.index + 1;
    if (isIndexValid(nextActiveStoryIndex, activeChannel.stories)) {
      setActiveStoryId(activeChannel.stories[nextActiveStoryIndex].id);
    } else {
      if (isIndexValid(nextActiveChannelIndex, channels)) {
        setActiveChannelId(channels[nextActiveChannelIndex].id);
        setActiveStoryId(channels[nextActiveChannelIndex].stories[0].id);
      } else {
        setActiveChannelId('');
      }
    }
  };

  const handlePrevClick = () => {
    if (!activeChannelId) {
      return;
    }
    const prevActiveChannelIndex = activeChannel.index - 1;
    const prevActiveStoryIndex = activeStory.index - 1;
    if (isIndexValid(prevActiveStoryIndex, activeChannel.stories)) {
      setActiveStoryId(activeChannel.stories[prevActiveStoryIndex].id);
    } else {
      if (isIndexValid(prevActiveChannelIndex, channels)) {
        setActiveChannelId(channels[prevActiveChannelIndex].id);
        const lastStoryIndex =
          channels[prevActiveChannelIndex].stories.length - 1;
        setActiveStoryId(
          channels[prevActiveChannelIndex].stories[lastStoryIndex].id
        );
      } else {
        setActiveChannelId('');
      }
    }
  };

  return (
    <div className="container">
      <Actions onNext={handleNextClick} onPrev={handlePrevClick} />
      <div>
        {channels.map((channel) => (
          <ChannelCircle
            key={channel.id}
            cover={channel.icon}
            onClick={() => handleCircleClick(channel.id)}
          />
        ))}
      </div>
      {activeStory && <img className="story" src={activeStory.image} />}
    </div>
  );
}
