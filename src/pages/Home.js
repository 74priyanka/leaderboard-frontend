import React, { useState, useEffect } from "react";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("daily");
  const [message, setMessage] = useState("");

  // Function to fetch user data based on the selected period
  const fetchUsers = async () => {
    setLoading(true); // Start loading

    try {
      const response = await fetch(
        `http://localhost:7000/api/user/v1/your-${period}-history`
      );
      const data = await response.json();
      console.log(`Fetched data for ${period}:`, data);
      if (data.success) {
        setUsers(data.data); // Update users with fetched data
        setMessage(""); // Clear message on successful fetch
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching user data.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch users based on the selected period
  useEffect(() => {
    fetchUsers();
  }, [period]);

  // Fetch all users on initial load
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:7000/api/user/v1/get-users"
        );
        const data = await response.json();
        if (data.success) {
          setUsers(data.data); // Initialize users
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        console.error("Error fetching all users:", error);
        setMessage("Error fetching all users.");
      }
    };
    fetchAllUsers();
  }, [period]);

  const claimPoints = async (username) => {
    try {
      const response = await fetch(
        "http://localhost:7000/api/user/v1/claim-points",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);

        // Update the user points in the local state
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.username === username
              ? {
                  ...user,
                  Points: user.Points + (data.data.Points - user.Points),
                } // Update with newly claimed points
              : user
          );

          // Sort by points in descending order
          return updatedUsers.sort((a, b) => b.Points - a.Points);
        });
      } else {
        throw new Error(data.message || "Failed to claim points");
      }
    } catch (error) {
      console.error("Error claiming points:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">HOME</h1>

      {/* Period Selection Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {["daily", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriod(tab)} // Set selected period
            className={`py-2 px-4 rounded ${
              period === tab
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-2 rounded mb-4 ${
            message.includes("not found")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Leaderboard Display */}
      <div className="bg-white shadow-md rounded p-6 space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : users.length > 0 ? (
          users
            .sort((a, b) => b.Points - a.Points)
            .map((user, index) => (
              <div
                key={user._id}
                className="flex items-center justify-between border-b pb-4 mb-4 cursor-pointer"
                onClick={() => claimPoints(user.username)} // Call claimPoints on user name click
              >
                <div>
                  <p className="font-semibold">
                    {user.username}
                    <span className="text-gray-500">(Rank: {index + 1})</span>
                  </p>
                  <p className="text-gray-500">Prize: ₹{user.Points}</p>
                </div>
                <div className="text-green-600 font-bold">{user.Points}</div>
              </div>
            ))
        ) : (
          <p>No users found for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
