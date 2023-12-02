type Props = {
  name: string;
  label: string;
  error: string | undefined | null;
  inputRef?: React.RefObject<HTMLInputElement>;
};
export default function TextField({
  name,
  label,
  inputRef,
  error,
  ...props
}: Props & React.HTMLProps<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          ref={inputRef}
          id={name}
          name={name}
          className={`w-full rounded border border-gray-500 px-2 py-1 text-lg ${
            error ? "animate-bounce-once border-red-500" : ""
          }`}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          {...props}
        />
        {error ? (
          <div className="pt-1 text-red-700" id={`${name}-error`}>
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
