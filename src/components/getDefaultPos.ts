import { useSearchParams } from "react-router-dom";

let [searchParams] = useSearchParams();
const defaultPosition = "v199";
export const startPosition = searchParams.get("position") || defaultPosition;