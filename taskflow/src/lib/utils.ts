import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function getAbsoluteUrl(path: string) {

  return `${import.meta.env.VITE_PUBLIC_APP_URL}${path}`;
}