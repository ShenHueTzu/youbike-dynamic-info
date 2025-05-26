import Image from "next/image";
import { icons } from "@/pages/constants/icons";

interface Props {
  size?: "s" | "m";
  type: string;
  onClick: () => void;
}

const Icon = ({ type, onClick, size = "s" }: Props) => {
  if (!type || !icons[type]) return <></>;
  return (
    <Image
      onClick={onClick}
      src={icons[type]}
      width={size === "m" ? 20 : 16}
      height={size === "m" ? 20 : 16}
      className="cursor-pointer"
      alt={type}
    />
  );
};
export default Icon;
