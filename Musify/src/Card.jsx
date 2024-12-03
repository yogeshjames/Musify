import { useState, useEffect } from 'react';
import { AiOutlineHeart, AiFillHeart, AiOutlinePlus } from 'react-icons/ai';
import axios from 'axios';

function Card({ song, func, is, playSong, inc, index, priv }) {
  const [likedsongs, setLikedsongs] = useState([]);
  const [liked, setLiked] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  console.log(song);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/likedd', {
          params: { id: window.localStorage.getItem('id') },
        });
        const x = res.data.likedsongs;
        setLikedsongs(x);
        setLiked(x.includes(song.id));
      } catch (err) {
        console.log(err);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get('http://localhost:3000/playlistdetails', {
          params: { id: window.localStorage.getItem('id') },
        });
        setPlaylists(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaylists();
  }, []);

  const handleLike = async () => {
    const userId = localStorage.getItem('id');

    if (!userId) {
      console.log('User is not logged in');
      return;
    }
    if (!liked) {
      setLiked(true);
      try {
        const response = await axios.post('http://localhost:3000/like', {
          userId: userId,
          songId: song.id,
        });

        if (response.status === 200) {
          setLikedsongs([...likedsongs, song.id]);
          return;
        } else {
          console.log('Failed to like song:', response.data.message);
        }
      } catch (error) {
        console.error('Error liking song:', error);
      }
    } else {
      setLiked(false);
      try {
        const response = await axios.post('http://localhost:3000/unlike', {
          userId: userId,
          songId: song.id,
        });

        if (response.status === 200) {
          setLikedsongs((prev) => prev.filter((id) => id !== song.id));
          func(song.id);
          return;
        } else {
          console.log('Failed to unlike song:', response.data.message);
        }
      } catch (error) {
        console.error('Error unliking song:', error);
      }
    }
  };

  const addToPlaylist = () => {
    setShowPlaylists(!showPlaylists);
  };

  return (
    <div className="relative flex m-5">
      <div
        onClick={() => {
          playSong(song);
          if (inc) {
            inc(++index);
          }
        }}
        className="card bg-slate-100 cursor-pointer button-hover-effect shadow-md rounded-md p-4 m-2 w-60"
      >
        <img
          src={priv ? song.image : song.album.images[0].url}
          alt={song.name}
          className="w-full h-40 object-cover rounded-md"
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold truncate">{song.name}</h2>
          <p className="text-gray-600 truncate">
            {priv ? song.artist : song.artists[0].name}
          </p>
        </div>
        {is && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="text-red-500 text-2xl z-10"
            >
              {liked ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
            <button
              onClick={(e) => {
                addToPlaylist();
              }}
              className="text-blue-500 text-2xl"
            >
              <AiOutlinePlus />
            </button>
          </div>
        )}
        {showPlaylists && (
          <div
            className="absolute top-56 left-3/4 w-full z-30 bg-white border border-gray-200 rounded-lg shadow-md z-50"
            onMouseLeave={addToPlaylist}
          >
            <ul>
              {playlists.map((playlist) => (
                <li
                  key={playlist._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={async (e) => {
                    addToPlaylist();
                    await axios.post('http://localhost:3000/addtoplaylist', {
                      id: playlist._id,
                      song: song,
                    });
                  }}
                >
                  {playlist.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
