import { toast } from "react-toastify";

// Return the correct floor to switch to.
function formatFloorLabel(floor: string) {
  switch (floor) {
    case "floor0": return "Basement";
    case "floor1": return "1st Floor";
    case "floor2": return "2nd Floor";
    case "floor3": return "3rd Floor";
    default: return floor;
  }
}

export function showFloorSwitchToast(
  nextFloor: string, 
  setCurrentFloor: (floor: string) => void
  )
{
  toast.info(
    <div className="flex flex-col space-y-1">
      <span> Continue on {formatFloorLabel(nextFloor)}</span>
      <button
        onClick={() => {
          setCurrentFloor(nextFloor)
          toast.dismiss();
        }}
        className="mt-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        Switch Floor
      </button>
    </div>,
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: true,
      position: "bottom-right",
    }
  );
}