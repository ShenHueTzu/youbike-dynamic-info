import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BarProps } from "../constants/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
const BarChart = ({ data }: BarProps) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>
        Youbike Monthly Usage - Tapei City
      </h2>
      <Bar
        data={data}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
};
export default BarChart;
