import { Marker, useMap } from "@vis.gl/react-google-maps";
import { YouBikeStation, ActiveStation } from "../constants/types";
import Icon from "./common/Icon";

export const Pin = ({
  data,
  activeId,
  onSelectStation,
}: {
  data: YouBikeStation;
  activeId: number;
  onSelectStation: (prop: ActiveStation) => void;
}) => {
  const map = useMap();
  const onClickMarker = () => {
    onSelectStation(data);

    if (map) {
      map.panTo({ lat: data.latitude, lng: data.longitude });
    }
  };
  const getVacancyColor = (
    active: number,
    total: number,
    availables: number,
  ) => {
    if (active === 0) return "gray";
    if (availables === 0) return "#ff0000";
    if (availables / total < 0.3) return "#ffdc00";
    return "#00dc00";
  };
  const isActive = activeId === data.sno;
  return (
    <>
      {isActive && (
        <div className="absolute z-999 top-[80px] right-[20px] bg-gray-100 border-1 border-gray-500 py-[12px] px-[16px] rounded w-[360px]">
          <div className="block text-gray-900">
            <div className="font-bold flex items-center justify-between mb-2">
              Station Info
              <Icon type="close" onClick={() => onSelectStation({ sno: 0 })} />
            </div>
            <div className="text-sm">station: {data.sna}</div>
            <div className="text-sm">address: {data.ar}</div>
            <div className="text-sm">
              available bikes: {data.available_rent_bikes}
            </div>
            <div className="text-sm">total: {data.total}</div>
          </div>
        </div>
      )}
      <Marker
        position={{ lat: data.latitude, lng: data.longitude }}
        icon={{
          path: isActive
            ? window.google.maps.SymbolPath.BACKWARD_OPEN_ARROW
            : window.google.maps.SymbolPath.CIRCLE,
          fillColor: getVacancyColor(
            data.act,
            data.total,
            data.available_rent_bikes,
          ),
          fillOpacity: isActive ? 1 : 0.5,
          strokeColor: isActive ? "oklch(12.9% 0.042 264.695)" : "#ffffff",
          strokeWeight: isActive ? 2 : 1,
          scale: isActive ? 8 : 6,
        }}
        onClick={onClickMarker}
      />
    </>
  );
};

export default Pin;
