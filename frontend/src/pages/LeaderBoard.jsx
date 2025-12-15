import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch(
        "https://habitcycle.onrender.com/api/users/leaderboard",
        { credentials: "include" }
      );
      const data = await res.json();
      setUsers(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            🏆 Leaderboard
          </h1>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Rank</th>
                <th className="py-2">User</th>
                <th className="py-2">🔥 Streak</th>
                <th className="py-2">⭐ Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b last:border-none"
                >
                  <td className="py-2 font-semibold">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && index + 1}
                  </td>
                  <td className="py-2">{user.username}</td>
                  <td className="py-2 text-orange-600 font-semibold">
                    {user.streak}
                  </td>
                  <td className="py-2 text-blue-600 font-semibold">
                    {user.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
