import { useState, useEffect } from "react";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Header from "./Header.jsx";
import axios from "axios";
import Card from "./Card.jsx";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Audio from './Audioplayer/Audio.jsx';

function Songs() {
  const [songs, setsongs] = useState("hello");
  const [s, setS] = useState([]);
  const [token, setToken] = useState("");
  const [playing, setPlaying] = useState(null);
  const [isuser, setisuser] = useState(false);
  const [who, setwho] = useState("songs"); // Displaying the current search mode
  const [user, setuser] = useState(""); // To type the user
  const [theuser, settheuser] = useState(null); // Get the object of the user typed
  const [sent, setsent] = useState("");
  const userId = window.localStorage.getItem("id");
  const [recom, setrecom] = useState([]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post("http://localhost:3000/get-token");
        setToken(response.data.access_token);
        window.localStorage.setItem("token", response.data.access_token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (isuser) return; // Fetch songs only when in song search mode

    const fetchSongs = async () => {
      if (token) {
        try {
          const response = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              q: songs,
              type: "track",
              limit: 7,
            },
          });
          setS(response.data.tracks.items);

          try {
            const x = await axios.get("http://localhost:3000/recommandation", {
              params: { id: userId },
            });
            const res = await axios.get(
              `https://api.spotify.com/v1/recommendations?seed_artists=${x.data?.artistid}&seed_tracks=${x.data?.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setrecom(res.data.tracks);
          } catch (error) {
            console.error("Error fetching recommendations:", error);
          }
        } catch (error) {
          console.error("Error fetching songs:", error);
        }
      }
    };

    fetchSongs();
  }, [token, songs, isuser]);

  useEffect(() => {
    if (!isuser || user === window.localStorage.getItem("name")) return; // Fetch user data only when in user search mode

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/giveuser", { params: { user } });
        if (res.status === 200) {
          settheuser(res.data); // Set only if a user is found
        } else {
          console.log(res.data.message);
          settheuser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [user, isuser]);

  const sendrequest = async () => {
    try {
      await axios.post("http://localhost:3000/sendrequest", {
        senderid: window.localStorage.getItem("id"),
        receiverid: theuser.id,
      });
      toast.success("Friend request sent");
    } catch (error) {
      toast.error("Error sending friend request");
    }
  };

  const toggleSearchMode = () => {
    setisuser(!isuser);
    setwho(who === "songs" ? "user" : "songs");

    // Clear states based on search mode
    if (isuser) {
      setsongs(""); // Clear song search state
      setS([]);
      setrecom([]);
    } else {
      setuser(""); // Clear user search state
      settheuser(null);
      setsent("");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="w-full p-6 flex justify-center items-center bg-gradient-to-r from-teal-400 to-cyan-600 text-white overflow-auto">
        <div className="relative w-1/3 overflow-hidden">
          <input
            type="text"
            className="w-full px-6 py-3 border border-transparent rounded-lg shadow-md outline-none text-gray-800"
            placeholder={`Search for ${who === "songs" ? "songs" : "users"}...`}
            value={isuser ? user : songs}
            onChange={(e) => {
              if (isuser) setuser(e.target.value);
              else setsongs(e.target.value);
            }}
          />
          <AiOutlineSearch
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => {
              if (isuser) setuser("");
              else setsongs("");
            }}
          />
        </div>
        <button
          className="ml-4 px-4 py-2 rounded-lg bg-white text-indigo-600 font-semibold shadow hover:bg-gray-100"
          onClick={toggleSearchMode}
        >
          {`Switch to ${who === "songs" ? "User Search" : "Song Search"}`}
        </button>
      </div>

      {isuser ? (
        <div className="flex flex-col items-center justify-center">
          {theuser ? (
            <div className="flex flex-col md:flex-row items-center justify-between border-2 border-gray-300 shadow-md rounded-lg p-6 my-8 bg-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center text-xl">
                  {theuser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold text-gray-800">
                    Name: <span className="text-gray-600">{theuser.name}</span>
                  </h1>
                  <p className="text-lg font-serif text-gray-700">
                    Email: <span className="text-gray-600">{theuser.email}</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={sendrequest}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
                >
                  Add Friend
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg font-serif">
                No such user found. Please check the name and try again.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 bg-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {s.map((song) => (
              <Card key={song.id} song={song} is={true} playSong={setPlaying} />
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended Songs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recom.slice(0, 5).map((track) => (
                <Card key={track.id} song={track} is={true} playSong={setPlaying} />
              ))}
            </div>
          </div>
        </div>
      )}

      {playing && (
        <div className="fixed bottom-3 left-0 w-full">
          <Audio src={playing} />
        </div>
      )}
    </>
  );
}

export default Songs;
