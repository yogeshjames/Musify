import React, { useEffect, useState } from "react";
import AudioPlayer from "./Audioplayer";
import axios from 'axios';
  const token = window.localStorage.getItem("token");
function Audio({ src, SongEnd ,priv }) {
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lyric,setlyric]=useState('');
  const userId = window.localStorage.getItem('id');
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = `https://open.spotify.com/track/${src.id}`;
        const url = `https://itzpire.com/download/aio?url=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        setLink(data.data.download);
        setLoading(false);


const x =await axios.get(`https://api.spotify.com/v1/artists/${src.artists[0].id}`,{
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const genre = x.data.genres[0];
        await axios.post('http://localhost:3000/currentlyplaying', {
          userId,
          song: {
            id: src.id,
            artistid:src.artists[0].id,
            name: src.name,
            artist: src.artists[0].name,
            albumImage: src.album.images[0].url,
            genre:genre
          }
        });
        
  if(priv){
    setLink(src.preview_url)//if i use link in src of audio even its priv it shld work
  }
        const ly=  await axios.get('http://localhost:3000/lyrics',{params:{artist:priv ? src.artist : src.artists[0].name,song:src.name}})
        setlyric(ly.data)
        ///im collecting only the 1st 500 letters
      } catch (error) {///even tho we dont add lyrics in priv song we use this or else it will not load the page if given only the lyrics will not be loaded
        console.error("Error:", error);
       // setLoading(false);
      }
    };

    fetchData();
  }, [src.id,src]);//// src.id will not be thefre if its priv thats why i added src

  if (loading) {
    return <p>Loading audio...</p>;
  }

  return (
    <div className="audio-player">
      <div className='audio-player p-4 bg-pink-200 rounded-lg shadow-lg flex items-center font-serif'>
        <img src={ priv ? src.image : src.album.images[0].url  } alt={src.name} className='w-20 h-20 object-cover rounded-md mr-4' />
        <div className='song-details'>
          {link || priv ? <AudioPlayer src={link} next={SongEnd} /> : <p>No audio available</p>
          //chnage it to src.preview_url if u want only 30 sec or works 100%
          //{link} if u want full song but this takes time(speed inetrnet) and even uhv to refresh  coz of the api issue
          /// while using privsong link is null always thats y i use priv in or 
          }
          <h2 className='text-xl font-bold'>{src.name}</h2>
          <p>{
            !priv && 
             lyric}
        </p>
          <h2 className='text-lg text-gray-700'>{ priv ? src.artist : src.artists[0].name }</h2>
        </div>
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default Audio;
