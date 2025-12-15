import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PointsChart from "../components/PointsChart";
import Leaderboard from "../components/Leaderboard";

const Home = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pointsHistory, setPointsHistory] = useState([]);
  const [stats, setStats] = useState({
    points: 0,
    streak: 0,
    badges: [],
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const POINTS_ADDED = 10;

  // ================= FETCH DATA =================

  const fetchHabits = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users/habits", {
        credentials: "include",
      });
      const data = await res.json();
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsHistory = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/users/points/history",
        { credentials: "include" }
      );
      const data = await res.json();
      setPointsHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users/stats", {
        credentials: "include",
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHabits();
    fetchPointsHistory();
    fetchStats();
  }, []);

  // ================= DONE HANDLER =================

  const handleDone = async (habitId) => {
    try {
      const res = await fetch("http://localhost:3000/api/users/points/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: POINTS_ADDED, habitId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPopupMessage(
        data.message ||
          `+${POINTS_ADDED} points 🎉\n🔥 Streak: ${data.streak} days`
      );
      setShowPopup(true);

      setHabits((prev = []) =>
        prev.map((h) =>
          h._id === habitId ? { ...h, lastCompleted: today } : h
        )
      );

      fetchPointsHistory();
      fetchStats();
      setTimeout(() => setShowPopup(false), 2500);
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= DELETE HANDLER =================

  const handleDelete = async (habitId) => {
    if (!window.confirm("Delete this habit?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/users/habits/${habitId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHabits((prev = []) =>
        prev.filter((habit) => habit._id !== habitId)
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {pointsHistory.length > 0 && (
              <PointsChart data={pointsHistory} />
            )}

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-sm text-gray-500">🔥 Current Streak</h2>
              <p className="text-3xl font-bold text-orange-500">
                {stats.streak} days
              </p>
              <p className="text-sm text-gray-600">
                ⭐ Total Points: {stats.points}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Your Habits</h1>
                <a
                  href="/habit/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  + Add Habit
                </a>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : habits.length === 0 ? (
                <p>No habits yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {habits.map((habit) => {
                    const isDoneToday =
                      habit.lastCompleted === today;

                    return (
                      <div
                        key={habit._id}
                        className="bg-white p-5 rounded-xl shadow"
                      >
                        <h2 className="font-semibold">{habit.name}</h2>

                        <div className="mt-4 flex gap-2">
                          <button
                            disabled={isDoneToday}
                            onClick={() => handleDone(habit._id)}
                            className={`flex-1 py-2 rounded-lg ${
                              isDoneToday
                                ? "bg-gray-200"
                                : "border hover:bg-gray-100"
                            }`}
                          >
                            {isDoneToday ? "Completed ✅" : "Done"}
                          </button>

                          <button
                            onClick={() => handleDelete(habit._id)}
                            className="px-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <h2 className="text-green-600 font-semibold">🎉 Success</h2>
            <p className="mt-2 whitespace-pre-line">{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
