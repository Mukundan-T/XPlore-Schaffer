/**
 * Handles the logic behind the help button - when clicked, a modal will pop up with information
 * about the website.
 */

import { useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import Tooltip from "./ui/Tooltip";
import { Dialog, DialogBody, DialogHeader } from "./ui/Dialog";

function Help() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <>
    <Tooltip content="Need Help?" className="bg-green-500">
      <button
        onClick={toggle}
        className="ml-1 h-12 w-12 bg-green-500 center rounded text-white"
      >
        <BsQuestionCircle size={22}/>
      </button>
    </Tooltip>

      <Dialog open={open} handler={toggle}>
        <DialogHeader>Web Guide</DialogHeader>
        <DialogBody>
          <ul className="text-md text-gray-700 list-disc ml-4 space-y-2">
            <li className="flex items-center list-disc gap-3">
              <img
                src="/images/EditPosition.png"
                alt="Edit position button"
                className="w-10 h-10 rounded border"
                draggable={false}
              />
              <span><strong> Edit Position:</strong> Change your starting location on the map, even to a spot 
            on a different floor.</span>
            </li>
            <li className="flex items-center gap-3">
              <img
                src="/images/ResetPosition.png"
                alt="Reset position button"
                className="w-10 h-10 rounded border"
                draggable={false}
              />
              <span><strong> Reset Position:</strong> Reset your start location to the current location.</span>
            </li>
          </ul>
        </DialogBody>
      </Dialog>
    </>
  );
}

export default Help;