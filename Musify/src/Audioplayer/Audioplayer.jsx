import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlayCircle, AiOutlinePauseCircle, AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioPlayer = ({ src, next }) => {
  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef(new Audio(src));

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = src;
    setLoaded(false);

    const handleLoadedData = () => {
      setLoaded(true);
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(progress);
      setCurrentTime(audio.currentTime);
      if (audio.ended && next) {//only if from playlist
        next();
      }
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    console.log(src)
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.pause();
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [src]);// i have not added src coz its keep changing soo it often reloads add it if u want 

  const skipForward = () => {
    const audio = audioRef.current;
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!isPlaying);
  };

  const handleProgressBarChange = (e) => {
    const audio = audioRef.current;
    const newProgress = parseInt(e.target.value, 10);
    const newTime = (newProgress / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  return (
    <div className="audio-player absolute bottom-6 left-72 shadow-lg flex items-center justify-between w-2/3">
      {!loaded && <div>Loading...(try diff song)</div>}
      {loaded && (
        <>
          <div className="controls flex items-center space-x-4">
            <button onClick={skipBackward} className="text-3xl text-gray-700">
              <AiOutlineMinusCircle />
            </button>
            <button onClick={togglePlayPause} className="text-3xl text-gray-700">
              {isPlaying ? <AiOutlinePauseCircle /> : <AiOutlinePlayCircle />}
            </button>
            <button onClick={skipForward} className="text-3xl text-gray-700">
              <AiOutlinePlusCircle />
            </button>
          </div>
          <div className="progress-bar flex items-center space-x-2 w-full">
            <span className="text-gray-700">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressBarChange}
              className="w-full"
            />
            <span className="text-gray-700">{formatTime(duration)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
