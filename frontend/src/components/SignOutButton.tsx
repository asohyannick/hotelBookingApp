import { useMutation, useQueryClient } from "react-query"
import * as apiClient from '../api-client';
import { useAppContext } from "../context/AppContext";
export default function SignOutButton() {
  const queryClient = useQueryClient();
  const {showToast} = useAppContext();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async() => {
      await queryClient.invalidateQueries("validateToken")
      showToast({message: "User has been signed out successfully!", type: "SUCCESS"});
    },
    onError:(error:Error) => {
      showToast({message: error.message, type: "ERROR"})
    },
  });
  const handleClick = () => {
    mutation.mutate();
  }
  return (
    <button className='text-blue-600 px-3 font-bold bg-white hover:bg-gray-100' onClick={handleClick}>
      Sign Out
    </button>
  )
}
