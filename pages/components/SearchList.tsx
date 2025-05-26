import { useMap } from "@vis.gl/react-google-maps";
import { YouBikeStation } from "../constants/types";
import Button from "./common/Button";
import Icon from "./common/Icon";

interface Props {
  isSearching: boolean;
  list: YouBikeStation[];
  onClickSearch: () => void;
  onSelectStation: (data: YouBikeStation) => void;
  setIsSearching: (val: boolean) => void;
}

const SearchList = ({
  isSearching,
  list,
  onClickSearch,
  onSelectStation,
  setIsSearching,
}: Props) => {
  const map = useMap();
  const onClickStation = (data: YouBikeStation) => {
    onSelectStation(data);

    if (map) {
      map.panTo({ lat: data.latitude, lng: data.longitude });
    }
  };
  return (
    <>
      <div className="absolute top-[20px] right-[20px] z-99 cursor-pointer w-[max-content]">
        <Button text="Search in 3 km" theme="light" onClick={onClickSearch} />
      </div>
      {isSearching && list.length > 0 && (
        <div className="absolute top-[20px] left-[20px] p-[20px] bg-gray-100 border-1 border-gray-500 rounded h-[90%]">
          <div className="flex justify-between items-center">
            <div className="text-gray-900 font-bold">Available Station</div>
            <Icon type="close" onClick={() => setIsSearching(false)} />
          </div>
          <div className="h-[100%] overflow-scroll">
            {list.map((station) => (
              <div
                key={station.sno}
                className="cursor-pointer flex flex-col py-2 hover:text-gray-900 duration-300"
                onClick={() => onClickStation(station)}
              >
                <span>{station.sna}</span>
                <span>available: {station.available_rent_bikes}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchList;
