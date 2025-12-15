import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(
        "https://habitcycle.onrender.com/api/users/user/profile",
        { credentials: "include" }
      );
      const data = await res.json();
      setUser(data);
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            👤 Profile
          </h1>

          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">Username:</span>{" "}
              {user.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {user.email}
            </p>
            <p>
              <span className="font-semibold">⭐ Points:</span>{" "}
              {user.points}
            </p>
            <p>
              <span className="font-semibold">🔥 Streak:</span>{" "}
              {user.streak} days
            </p>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">🏆 Badges</h2>
            {user.badges.length === 0 ? (
              <p className="text-gray-500">No badges yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
