import { toast } from "react-hot-toast";

export function showToast(message: string) {
  toast.error(message);
}
