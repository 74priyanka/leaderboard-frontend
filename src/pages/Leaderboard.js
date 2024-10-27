import React, { useState, useEffect } from "react";
import UserHistory from "../components/UserHistory";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:7000/api/user/v1/get-users"
        );
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = async (username) => {
    setSelectedUsername(username);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">LEADERBOARD</h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {users
            .sort((a, b) => b.Points - a.Points) // Ensure this runs only when users is an array
            .map((user, index) => (
              <tr
                key={user._id}
                onClick={() => handleUserClick(user.username)} // Open modal on user click
                className="border-b cursor-pointer hover:bg-gray-100"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.Points}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {selectedUsername && (
        <UserHistory
          username={selectedUsername} // Pass the username to UserHistory
          closeModal={() => setSelectedUsername(null)}
        />
      )}
    </div>
  );
};

export default Leaderboard;
