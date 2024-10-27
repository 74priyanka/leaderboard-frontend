import React, { useState, useEffect } from "react";

const UserHistory = ({ username, closeModal }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    console.log("Received username:", username);
    const fetchHistory = async () => {
      if (!username) {
        console.error("Username is required to fetch history");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:7000/api/user/v1/your-history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }), // Send the username
          }
        );

        const data = await response.json();
        console.log("history data", data);

        if (!response.ok) {
          // Handle HTTP errors
          throw new Error(data.message || "Failed to fetch user history");
        }

        if (data.success) {
          setHistory(data.data);
        } else {
          throw new Error(data.message); // Set error if success is false
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
        setError(error.message); // Set the error message to state
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchHistory();
  }, [username]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">User History</h2>

        {loading ? ( // Show loading state
          <p>Loading...</p>
        ) : error ? ( // Show error if there's an error
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="space-y-2">
            {history.length > 0 ? (
              history.map((entry, index) => (
                <li key={index}>
                  <p>Date - {entry.date}</p>
                  <p> points awarded - {entry.pointsAwarded}</p>
                </li>
              ))
            ) : (
              <p>No history found for this user.</p> // Handle no history case
            )}
          </ul>
        )}

        <button
          onClick={closeModal}
          className="bg-red-500 text-white mt-4 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserHistory;
