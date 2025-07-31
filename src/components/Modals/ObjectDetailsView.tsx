/**
 * This module dictates how and what information appears when a zone is clicked on the
 * website.
 */

import { ObjectItem } from "@/utils/types";
import { FiNavigation } from "react-icons/fi";
import { DialogBody, DialogHeader } from "../ui/Dialog";

interface ObjectDetailsViewProps {
  object: ObjectItem;
  handleEditClick: () => void;
  objectNavigation: () => void;
}

function ObjectDetailsView({
  object,
  objectNavigation,
}: ObjectDetailsViewProps) {
  return (
    <>
      <DialogHeader>
        <p>{object.categoryName}</p>
      </DialogHeader>
      <DialogBody>
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-900">{object.name}</p>
          <p className="text-md text-gray-700">{object.desc}</p>
        </div>
        <div className="inline-flex rounded-md right-0 bottom-0 p-2 absolute">
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-800 hover:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
            onClick={objectNavigation}
          >
            <FiNavigation />
          </button>
        </div>

        {object.name === "Accommodative Services" && (
          <><p> Scan this QR Code to learn more! </p>
          <img
            src="/images/AccommodativeServices.png"
            alt="Accommodative Services QR Code"
            className="block mx-auto w-24 h-auto mt-4 rounded shadow"
          /></>
        )}

        {object.name === "Writing Center" && (
          <><p> Scan this QR Code to learn more! </p>
          <img
            src="/images/WritingCenter.png"
            alt="Writing Center QR Code"
            className="block mx-auto w-24 h-auto mt-4 rounded shadow"
          /></>
        )}

        {object.name === "Special Collections" && (
          <><p> Scan this QR Code to learn more! </p>
          <img
            src="/images/SpecialCollections.png"
            alt="Special Collections QR Code"
            className="block mx-auto w-24 h-auto mt-4 rounded shadow" 
          /></>
        )}

        {object?.name?.toLowerCase().includes("stacks") && (
          <><p> Scan this QR Code to go to Primo! </p>
          <img
            src="/images/Primo.png"
            alt="Primo QR Code"
            className="block mx-auto w-24 h-auto mt-4 rounded shadow"
          /></>
        )}

      </DialogBody>
    </>
  );
}

export default ObjectDetailsView;
