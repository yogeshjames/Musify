import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Header from './Header.jsx';

Chart.register(ArcElement, Tooltip, Legend);

const Stats = () => {
  const [history, setHistory] = useState([]);
  const [genre, setgenre] = useState({});
  const [artist, setartist] = useState({});
  const userId = window.localStorage.getItem('id');

  useEffect(() => {
    const history = async () => {
      try {
        const response = await axios.get('http://localhost:3000/listeninghistory', {
          params: { userId },
        });
        setHistory(response.data.history);
        process(response.data.history);
      } catch (error) {
        console.error('Error fetching listening history:', error);
      }
    };

    history();
  }, [userId]);

  const process = (history) => {
    const genres = {};
    const artists = {};

    // check the struct of the song we pass
    history.forEach((song) => {
        artists[song.artist] = (artists[song.artist] || 0) + 1;

      if (song.genre) {
          console.log(song.genre)
          genres[song.genre] = (genres[song.genre] || 0) + 1;/// we use bracket notation if the key chnages evrytime like the key willl be genre
      }
    });

    setgenre(genres);// this contains key as artist name and the songs in it and passs this to piechart 
    setartist(artists);
  };

  const piechart = (data) => {
    return {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],/// if the colour run outt it wil start using from 1st again
        },
      ],
    };
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Listening Stats</h2>
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2">Genre Distribution</h3>
          <div style={{ width: '400px', height: '400px' }}>
            <Pie data={piechart(genre)} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2">Artist Distribution</h3>
          <div style={{ width: '400px', height: '400px' }}>
            <Pie data={piechart(artist)} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Listening History</h3>
          <ol>
            {history.map((song, index) => (

              <li key={index} >
                <p>{song.name} by {song.artist}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default Stats;
