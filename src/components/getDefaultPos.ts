import { useSearchParams } from "react-router-dom";

export function getDefaultPos() {
    let [searchParams] = useSearchParams();
    const defaultPosition = "v199";
    return (searchParams.get("position") || defaultPosition);
}