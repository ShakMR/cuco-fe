type Props = {
  durationMs: number;
  text: string | null;
  show: boolean;
};
export const Toast = ({ durationMs = 3, text, show }: Props) => {
  return (
    <div
      className={`animate absolute bottom-10 left-2/4 rounded bg-gray-800 p-4 text-white opacity-0 backdrop-blur transition-opacity duration-${durationMs} ${
        show ? "opacity-100" : ""
      } animate-bounce ease-in-out`}
    >
      {text}
    </div>
  );
};
