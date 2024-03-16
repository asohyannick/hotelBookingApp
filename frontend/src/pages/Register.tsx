import { useForm } from "react-hook-form";
export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
export default function Register() {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const mutation = useMutation(apiClient.register, {
    onSuccess: async() => {
      showToast({ message: "User has been registered successfully!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken")
      navigate('/');
    },
    onError: () => {
      showToast({ message: "User already exist!", type: "ERROR" });
    },
  });
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            placeholder="john"
            className="border rounded w-full py-1 px-2 font-normal"
            id="firstName"
            {...register("firstName", {
              required: "The first name field is required",
            })}
          />
          {errors.firstName && (
            <span className="text-red-500 text-xs">
              {errors.firstName.message}
            </span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            placeholder="doe"
            className="border rounded w-full py-1 px-2 font-normal"
            id="lastName"
            {...register("lastName", {
              required: "The last name field is required",
            })}
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs">
              {errors.lastName.message}
            </span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Enter your Email
        <input
          type="email"
          placeholder="doe"
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
      <label className="text-gray-700 text-sm font-bold flex-1">
        confirm Password
        <input
          type="password"
          placeholder="**********"
          className="border rounded w-full py-1 px-2 font-normal"
          id="lastName"
          {...register("confirmPassword", {
            required: "The confirm password field is required",
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Your password do not match";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
}