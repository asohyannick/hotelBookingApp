import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
export type signInFormData = {
  email: string;
  password: string;
};
export default function SignIn() {
  const {showToast} = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    formState: { errors },handleSubmit
  } = useForm<signInFormData>();
  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async()=> {
      showToast({message: "User has been signed in successfully!", type: "SUCCESS"});
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || '/')
      // show the toast success message
      //navigate to the home page
    }, onError: (error: Error) => {
      // show the toast error messsage
      showToast({message: error.message, type: "ERROR"})
    }
  });
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Enter your Email
        <input
          type="email"
          placeholder="john doe"
          className="border rounded w-full py-1 px-2 font-normal"
          id="lastName"
          {...register("email", { required: "The email field is required" })}
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Enter your Password
        <input
          type="password"
          placeholder="*********"
          className="border rounded w-full py-1 px-2 font-normal"
          id="lastName"
          {...register("password", {
            required: "The password field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not registered? <Link className="underline" to='/register'>
            Create an account here
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Login
        </button>
      </span>
    </form>
  );
}