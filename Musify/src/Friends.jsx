import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

function Friends() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendssongs, setFriendssongs] = useState([]);
  const userId = window.localStorage.getItem('id');
  const navigate = useNavigate();

  useEffect(() => {
    const requests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/friendrequests', {
          params: { id: userId },
        });
        setFriendRequests(response.data.friendRequest);

        const x = await axios.get('http://localhost:3000/friendswithsongs', {
          params: { id: userId },
        });
        setFriendssongs(x.data.friendsWithsongs);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://localhost:3000/friends', {
          params: { id: userId },
        });
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    requests();
    fetchFriends();
  }, [userId]);



  const accept = async (senderId) => {
    try {
      const response = await axios.post('http://localhost:3000/acceptrequest', {
        receiverid: userId,
        senderid: senderId,
      });
      setFriendRequests(friendRequests.filter((request) => request.id !== senderId));
      setFriends(response.data.friends);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <>
      <Header />

      <div className="flex w-full min-h-screen bg-gray-100">
        {/* Friend Requests Section */}
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Friend Requests</h2>
          <ul className="space-y-4">
            {friendRequests.map((request) => (
              <li
                key={request.id}
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{request.name}</p>
                  <p className="text-gray-600">{request.email}</p>
                </div>
                <button
                  className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-all"
                  onClick={() => accept(request.id)}
                >
                  Accept
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Friends Section */}
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Friends</h2>
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    <span className="font-bold">Name:</span> {friend.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Email:</span> {friend.email}
                  </p>
                </div>
              </li>
            ))}

            {friendssongs.map((friendx) => (
              <li
                key={friendx.id}
                className="p-4 bg-white rounded-lg shadow-md flex flex-col space-y-4"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    <span className="font-bold">Name:</span> {friendx.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Email:</span> {friendx.email}
                  </p>
                </div>
                {friendx.currentSong && (
                  <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                    <img
                      src={friendx.currentSong.albumImage}
                      alt={friendx.currentSong.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="text-gray-800">
                        <span className="font-bold">Current Song:</span>{' '}
                        {friendx.currentSong.name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-bold">Artist:</span> {friendx.currentSong.artist}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Friends;
