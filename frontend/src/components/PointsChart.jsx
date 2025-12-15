import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white shadow rounded-lg px-3 py-2 text-sm">
      <p className="font-medium">{formatDate(label)}</p>
      <p className="text-blue-600 font-semibold">
        ⭐ Total Points: {payload[0].value}
      </p>
    </div>
  );
};

const PointsChart = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  // Sort by date
  const sorted = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Convert to cumulative total
  let runningTotal = 0;
  const chartData = sorted.map((item) => {
    runningTotal += item.points;
    return {
      date: item.date,
      totalPoints: runningTotal
    };
  });

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        📈 Total Points Progress
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Each completed habit gives you <strong>10 points</strong>.
        This chart shows your total growth over time.
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="totalPoints"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PointsChart;
