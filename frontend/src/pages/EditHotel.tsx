import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import ManageHotelForm from "../forms/manageHotelForm/ManageHotelForm";
export default function EditHotel() {
  const { showToast } = useAppContext();
  const { hotelId } = useParams();
  const { data: hotel } = useQuery(
    "fetchMyHotelById",
     () => apiClient.fetchMyHotelById(hotelId || ""),
      {
        enabled: !!hotelId,
      }
  );
  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error occurred saving hotels", type: "ERROR" });
    },
  });
  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };
  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
  );
}
