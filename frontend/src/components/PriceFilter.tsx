type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};
export default function PriceFilter({ selectedPrice, onChange }: Props) {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        value={selectedPrice}
        className="p-2 border rounded-md w-full"
        onChange={(event) =>
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined
          )
        }
      >
        <option value="">Select Max Price</option>
        {[50, 100, 200, 300, 500].map((price) => (
          <option value={price} key={price}>{price}</option>
        ))}
      </select>
    </div>
  );
}
