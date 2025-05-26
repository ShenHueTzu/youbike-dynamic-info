import { ChartMode } from "@/pages/constants/types";

interface Props {
  data: { label: string; value: ChartMode }[];
  activeMode: string;
  setMode: (mode: ChartMode) => void;
}

const Tabs = ({ data, activeMode, setMode }: Props) => {
  return (
    <div className="flex gap-4 border-b-1 w-full justify-center">
      {data.map((tab) => (
        <div
          key={tab.value}
          className={`flex flex-col cursor-pointer w-[fit-content] ${activeMode === tab.value ? "text-rose-400 font-medium border-b-4" : ""}`}
          onClick={() => setMode(tab.value)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};
export default Tabs;
