import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../context/SearchContext";
import { useAppContext } from "../../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
type Props = {
  hotelId: string;
  pricePerNight: number;
};
type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};
export default function GuestInfoForm({ hotelId, pricePerNight }: Props) {
  const search = useSearchContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAppContext();
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childCount: search.childCount,
    },
  });
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
        "",
        data.checkIn,
        data.checkOut,
        data.adultCount,
        data.childCount
    )
    navigate('/sign-in', {state: {from: location}})
  }

  const onSubmit = (data: GuestInfoFormData) => {
   search.saveSearchValues(
    "",
    data.checkIn,
    data.checkOut,
    data.adultCount,
    data.childCount
   );
    navigate(`/hotel/${hotelId}/booking`,);
  };
  return (
    <div className="flex flex-col p-4 gap-4 bg-blue-200">
      <h3 className="text-md font-bold">{pricePerNight}</h3>
      <form onSubmit={isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)}>
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              selected={checkIn}
              required
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              placeholder="Check-in Date"
              minDate={minDate}
              maxDate={maxDate}
              wrapperClassName="min-w-full"
              className="min-w-full bg-white p-2 focus:outline-none"
            />
          </div>
          <div>
            <DatePicker
              selected={checkOut}
              required
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              placeholder="Check-in Date"
              minDate={minDate}
              maxDate={maxDate}
              wrapperClassName="min-w-full"
              className="min-w-full bg-white p-2 focus:outline-none"
            />
          </div>
          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Adults:
              <input
                type="number"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be atleast one adult",
                  },
                  valueAsNumber: true,
                })}
                className="w-full p-1 focus:outline-none font-bold"
              />
            </label>
            <label className="items-center flex">
              Children:
              <input
                type="number"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
                className="w-full p-1 focus:outline-none font-bold"
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>
          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to book
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
