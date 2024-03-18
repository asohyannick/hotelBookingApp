import { Link } from "react-router-dom";

interface Hotel {
  _id: string;
  imageUrls: string[];
  // Add any other properties of the hotel object
}

interface LatestDestinationCardProps {
  hotel: Hotel;
}

export default function LatestDestinationCard({ hotel}: LatestDestinationCardProps) {
  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-md"
    >
      <div className="h-[300px]">
        <img
          src={hotel.imageUrls[2]}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
        <span className="text-white font-bold tracking-tight text-3xl"></span>
      </div>
    </Link>
  );
}
