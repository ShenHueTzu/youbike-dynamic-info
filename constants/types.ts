import type { ChartData, ChartOptions } from "chart.js";
export interface YouBikeStation {
  act: number; // 0 or 1
  ar: string; // chinese address
  aren: string; // english address
  available_rent_bikes: number;
  available_return_bikes: number;
  infoDate: string; // yyyy-mm-dd
  infoTime: string; // yyyy-mm-dd HH:mm:ss
  latitude: number;
  longitude: number;
  mday: string; // infoTime
  sarea: string; // area chinese
  sareaen: string; // area eng
  sna: string; // station chinese
  snaen: string; // stattion eng
  sno: number; // stattion id
  srcUpdateTime: string;
  total: number;
  updateTime: string;
}

export type ActiveStation = YouBikeStation | { sno: 0 };
export type ChartMode = "bar" | "line";

export interface BarProps {
  data: ChartData<"bar">;
}
export interface LineProps {
  data: ChartData<"line">;
}
