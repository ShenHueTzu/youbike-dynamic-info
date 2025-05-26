interface Props {
  disabled?: boolean;
  text: string;
  theme: "light" | "dark";
  onClick: () => void;
}

const Button = ({ text, onClick, theme, disabled = false }: Props) => {
  return (
    <div
      className={`flex items-center justify-center px-2 py-1 border-1 border-gray-900 rounded cursor-pointer duration-300 hover:text-black hover:bg-gray-100 ${theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={disabled ? () => null : onClick}
    >
      {text}
    </div>
  );
};
export default Button;
