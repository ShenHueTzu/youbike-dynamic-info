import { GetStaticProps } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { DEFAULT_CENTER, UPDATE_TIME, usageData } from "../constants";
import { YouBikeStation, ActiveStation, ChartMode } from "../constants/types";
import { getDistance } from "../constants/utils";
import { Circle } from "../components/Circle";
import Pin from "../components/Pin";
import BarChart from "../components/Bar";
import LineChart from "../components/Line";
import Tabs from "../components/common/Tabs";
import SearchList from "../components/SearchList";

interface Station {
  sno: string;
  sna: string;
  tot: number;
  sbi: number;
}

interface Props {
  stations: Station[];
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Page() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const defaultActiveStation: ActiveStation = { sno: 0 };
  const [selectedStation, setSelectedStation] =
    useState<ActiveStation>(defaultActiveStation);
  useEffect(() => {
    setIsSearching(false);
    if (selectedStation.sno !== 0) {
      setCenter({
        lat: (selectedStation as YouBikeStation).latitude,
        lng: (selectedStation as YouBikeStation).longitude,
      });
    }
  }, [selectedStation.sno]);

  const onSelectStation = async (data: ActiveStation) => {
    if (timer === 0) await fetchStations();
    setSelectedStation(data);
  };

  const onCenterChanged = (data: {
    detail: { center: SetStateAction<{ lat: number; lng: number }> };
  }) => {
    setIsSearching(false);
    setCenter(data.detail.center);
  };

  const [timer, setTimer] = useState(UPDATE_TIME);
  const [data, setData] = useState<YouBikeStation[] | []>([]);
  const [stationsInDistance, setList] = useState<YouBikeStation[] | []>([]);

  const fetchStations = async () => {
    try {
      const resp = await fetch(
        "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json",
      );
      const list = await resp.json();
      setData(list);

      setTimer(60);
    } catch (error) {
      console.log(error, "fetch ubike info failed.");
    }
  };

  useEffect(() => {
    fetchStations();

    const timerInterval = setInterval(() => {
      setTimer((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const [isSearching, setIsSearching] = useState(false);
  const onClickSearch = async () => {
    setTimeout(() => setIsSearching(true));

    if (timer === 0) await fetchStations();

    const list: YouBikeStation[] = data.filter((station) => {
      const distance = getDistance(center, {
        lat: station.latitude,
        lng: station.longitude,
      });
      if (
        station.available_rent_bikes > 0 &&
        (distance < 3000 || distance === 3000)
      )
        return station;
    });
    setList(list);
  };

  const [isFocusing, setIsFocusing] = useState(false);
  const [searchText, setText] = useState("");
  const [recommendedOptions, setOptions] = useState<YouBikeStation[] | []>([]);
  useEffect(() => {
    setList([]);

    if (!searchText) return setOptions([]);

    const options = data.filter((item) => {
      if (item.snaen.includes(searchText) || item.sna.includes(searchText))
        return item;
    });

    setOptions(options);
  }, [searchText]);

  const tabsData: { label: string; value: ChartMode }[] = [
    {
      label: "Bar",
      value: "bar",
    },
    {
      label: "Line",
      value: "line",
    },
  ];
  const [activeMode, setMode] = useState<ChartMode>("bar");
  const [chartData, setChartData] = useState<null | any>(null);
  useEffect(() => {
    const getChartData = async () => {
      try {
        const resp = await fetch("/api/chart-data");
        const data = await resp.json();

        const newData = data.result.results.map(
          (item: { [x: string]: any; _id: any }) => ({
            id: item._id,
            date: Number(item["民國年月"]),
            usage: Number(item["臺北市youbike每月使用量（次數）"]),
          }),
        );

        const labels: string[] = newData.map(
          (data: { date: any }) => data.date,
        );
        const list: string[] = newData.map(
          (data: { usage: any }) => data.usage,
        );

        const chart = {
          labels,
          datasets: [
            {
              label: "Usages in a month",
              data: list,
              borderWidth: 1,
              backgroundColor: "oklch(81% 0.117 11.638)",
            },
          ],
        };
        setChartData(chart);
      } catch (error) {
        console.log(error, "fetch monthly usage failed.");
      }
    };
    getChartData();
  }, []);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex flex-col items-center justify-center px-[20px] py-[60px] gap-10 font-[family-name:var(--font-geist-sans)]`}
    >
      <span className="font-bold text-xl">Youbike Station Map</span>
      <div className="w-full relative">
        <input
          placeholder="Please enter station name in Chinese or English..."
          className="w-[-webkit-fill-available] border-1 px-2 py-1 rounded-md"
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocusing(true)}
          onBlur={() => setTimeout(() => setIsFocusing(false), 150)}
        />
        {isFocusing && recommendedOptions.length > 0 && (
          <div className="absolute top-[40px] w-full max-h-[200px] overflow-scroll z-100 rounded-md border-1">
            {recommendedOptions.map((opt) => (
              <div
                key={opt.sno}
                className="px-2 py-1 cursor-pointer bg-white hover:bg-gray-100 duration-300"
                onClick={() => onSelectStation(opt)}
              >
                {opt.sna} ({opt.snaen})
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
          region="TW"
        >
          <Map
            style={{ width: "100vw", height: "80vh" }}
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={13}
            disableDefaultUI={true}
            onCenterChanged={onCenterChanged}
          >
            {data.map((position) => (
              <Pin
                key={position.sno}
                data={position}
                activeId={selectedStation.sno}
                onSelectStation={(props) => onSelectStation(props)}
              />
            ))}
            {isSearching && (
              <Circle center={center} radius={3000} visible={true}></Circle>
            )}

            <SearchList
              isSearching={isSearching}
              list={stationsInDistance}
              onClickSearch={onClickSearch}
              onSelectStation={onSelectStation}
              setIsSearching={(val: boolean) => setIsSearching(val)}
            />
          </Map>
        </APIProvider>
      </div>
      <Tabs
        data={tabsData}
        activeMode={activeMode}
        setMode={(mode: ChartMode) => setMode(mode)}
      />
      <div className="m-[20px] w-[600px]">
        {activeMode === "bar" && chartData && <BarChart data={chartData} />}
        {activeMode === "line" && chartData && <LineChart data={chartData} />}
      </div>
    </div>
  );
}
