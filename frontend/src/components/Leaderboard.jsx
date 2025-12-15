import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/users/leaderboard",
          { credentials: "include" }
        );
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading leaderboard...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        🏆 Leaderboard
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500">No users yet</p>
      ) : (
        <div className="overflow-x-auto">
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
                  key={user._id || index}
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
      )}
    </div>
  );
};

export default Leaderboard;
