type Props<T> = {
  name: string;
  label: string;
  error: string | undefined | null;
  options: {
    label: string;
    value: T;
  }[];
  selectRef?: React.RefObject<HTMLSelectElement>;
};

type OptionValueType = string | number | readonly string[] | undefined;

export default function SelectField<T extends OptionValueType>({
  name,
  label,
  selectRef,
  options,
  error,
  ...props
}: Props<T> & React.HTMLProps<HTMLSelectElement>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <select
          ref={selectRef}
          id={name}
          name={name}
          className={`w-full rounded border border-gray-500 px-2 py-1 text-lg ${
            error ? "animate-bounce-once border-red-500" : ""
          }`}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          {...props}
        >
          {options.length > 1 ? (
            <option disabled value={""}>
              Select an option...
            </option>
          ) : (
            ""
          )}
          {options.map(({ value, label }) => (
            <option key={`${value}`} value={value} selected>
              {label}
            </option>
          ))}
        </select>
        {error ? (
          <div className="pt-1 text-red-700" id={`${name}-error`}>
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
