import { useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { YouBikeStation } from "@/constants/types";

interface Props {
  list: YouBikeStation[] | [];
  onChangeText: (text: string) => void;
  onSelectStation: (station: YouBikeStation) => void;
}
const SearchMenu = ({ list, onChangeText, onSelectStation }: Props) => {
  const [isFocusing, setIsFocusing] = useState(false);

  const map = useMap();
  const onClickStation = (data: YouBikeStation) => {
    onSelectStation(data);

    if (map) {
      map.panTo({ lat: data.latitude, lng: data.longitude });
    }
  };
  return (
    <div className="w-full px-[20px] flex mx-auto justify-center relative mb-[40px]">
      <input
        placeholder="Please enter station name in Chinese or English..."
        className="w-[-webkit-fill-available] border-1 px-2 py-1 rounded-md"
        onChange={(e) => onChangeText(e.target.value)}
        onFocus={() => setIsFocusing(true)}
        onBlur={() => setTimeout(() => setIsFocusing(false), 150)}
      />
      {isFocusing && list.length > 0 && (
        <div className="absolute top-[40px] w-full max-h-[200px] overflow-scroll z-100 rounded-md border-1">
          {list.map((opt) => (
            <div
              key={opt.sno}
              className="px-2 py-1 cursor-pointer bg-white hover:bg-gray-100 duration-300"
              onClick={() => onClickStation(opt)}
            >
              {opt.sna} ({opt.snaen})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchMenu;
