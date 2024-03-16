import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";

export default function Home() {
  const { data: hotel } = useQuery("fetchHotels", () =>
    apiClient.fetchHotels()
  );
  const topRowHotels = hotel?.slice(0, 2) || [];
  const bottomRowHotels = hotel?.slice(2) || [];
  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Lastest Destinations</h2>
      <p>Most recent destinations added by our hotels</p>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {topRowHotels.map((hotel, index) => (
                <LatestDestinationCard hotel={hotel} key={index}/>
            ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
            {bottomRowHotels.map((hotel, index) => (
                <LatestDestinationCard hotel={hotel} key={index}/>
            ))}
        </div>
      </div>
    </div>
  );
}
