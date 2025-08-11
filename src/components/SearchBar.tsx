/**
 * Implements the search bar at the top of the website.
 */

import Tooltip from "@/components/ui/Tooltip";
import {
  navigateToObject,
  navigateWithDelay as navigationTestAll,
} from "@/utils/navigationHelper";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FiCircle, FiNavigation } from "react-icons/fi";
import { useOnClickOutside } from "usehooks-ts";
import { MapDataContext, NavigationContext } from "../pages/Map";
import {
  MapDataContextType,
  NavigationContextType,
  ObjectItem,
} from "../utils/types";
import { useFloor } from "@/context/FloorContext";
import { toast } from "react-toastify";
// Uncomment when GA4 ID is generated
// import { trackEvent } from "@/store/analytics";

function SearchBar() {
  // Stores current user input string in search bar
  const [inputValue, setInputValue] = useState<string>("");

  // Get building objects (locations) from context (e.g. rooms, points of interest)
  const { objects } = useContext(MapDataContext) as MapDataContextType;

  // Suggestions list shown for autocomplete dropdown, starts with all objects
  const [suggestions, setSuggestions] = useState<ObjectItem[]>(objects);

  // Whether autocomplete dropdown is visible
  const [isAutocomplete, setIsAutocomplete] = useState<boolean>(false);

  // Tracks if user input was invalid (no match)
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);

  // Index of currently highlighted suggestion in dropdown (-1 means none selected)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Reference to the <ul> containing suggestion list, used for scrolling into view
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Reference to the <input> element for focus/blur management
  const inputRef = useRef<HTMLInputElement>(null);

  // Navigation state and setter from context to trigger routing/navigation
  const { navigation, setNavigation } = useContext(
    NavigationContext
  ) as NavigationContextType;

  // Editing mode setter, probably used elsewhere to disable other UI when typing
  const { setIsEditMode } = useContext(
    NavigationContext
  ) as NavigationContextType;

  // Current floor and setter from floor context, to update floor when navigating
  const { currentFloor, setCurrentFloor } = useFloor();

  // When the objects (locations) list changes, update suggestions accordingly
  useEffect(() => {
    setSuggestions(objects);
  }, [objects]);

  // Hook to detect clicks outside of suggestions dropdown:
  // If user clicks outside, hide autocomplete and exit edit mode
  useOnClickOutside(suggestionsRef, () => {
    setIsAutocomplete(false);
    setIsEditMode(false);
    if (inputRef.current) {
      inputRef.current.blur(); // remove input focus
    }
  });

  /**
   * Helper to remove duplicate objects by a key (e.g. name),
   * used to merge filtered name matches and description matches without repeats.
   */
  function removeDuplicates(
      arr: any[],
      key: string
  ): any[] {
      return arr.reduce((unique, item) => {
          // Check if the current object has the specified key
          if (item.hasOwnProperty(key)) {
              // Check if there is no existing object with the same key value
              if (!unique.some((obj: { [x: string]: any; }) => obj[key] === item[key])) {
                  unique.push(item);
              }
          } else {
              // If the key doesn't exist in the current object, always include it in the unique array
              unique.push(item);
          }
          return unique;
      }, []);
  }

  /**
   * Handle change in input text by user typing or keyboard input.
   * Filters suggestions based on name and description matching input.
   */
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setIsAutocomplete(true);

      // Filter objects whose name contains the input (case-insensitive)
      const filteredNames = objects.filter((obj) =>
        obj.name.toLowerCase().includes(value.trim().toLowerCase())
      );
      // Filter objects whose description contains the input (optional desc)
      const filteredDescs = objects.filter((obj) =>
        obj.desc?.toLowerCase().includes(value.trim().toLowerCase())
      );

      // Combine both filtered lists
      const allSuggestions: ObjectItem[] = filteredNames.concat(filteredDescs);

      // Remove duplicates based on 'name'
      const filteredSuggestions = removeDuplicates(allSuggestions, "name");

      setSuggestions(filteredSuggestions);
    } else {
      // Empty input hides autocomplete
      setIsAutocomplete(false);
    }
  }

  /**
   * Handles keyboard navigation in input:
   * ArrowDown / ArrowUp moves selection in dropdown
   * Enter triggers selection and navigation to that location
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (isAutocomplete) {
      if (event.key === "ArrowDown") {
        // Move selection down if not at bottom
        if (selectedIndex < suggestions.length - 1) {
          setSelectedIndex((prevIndex) => prevIndex + 1);
          // Update input field to show highlighted suggestion name
          setInputValue(suggestions[selectedIndex + 1].name);
        }
        event.preventDefault(); // prevent cursor move
      } else if (event.key === "ArrowUp") {
        // Move selection up if not at top
        if (selectedIndex > 0) {
          setSelectedIndex((prevIndex) => prevIndex - 1);
          setInputValue(suggestions[selectedIndex - 1].name);
        }
        event.preventDefault();
      } else if (event.key === "Enter" && selectedIndex >= 0) {
        // On Enter, confirm current selection and navigate
        handleSuggestionClick(suggestions[selectedIndex]);
        event.preventDefault();
        console.log(suggestions[selectedIndex].categoryName);

        navigateToObject(
          suggestions[selectedIndex].name,
          navigation,
          setNavigation,
          setCurrentFloor,
          currentFloor
        );
      }
    }
  }

  /**
   * Scrolls the suggestion list to keep the currently selected item visible.
   * Triggered when selectedIndex changes.
   */
  useEffect(() => {
    if (suggestionsRef.current && selectedIndex >= 0) {
      const suggestionElements = suggestionsRef.current.children;
      if (suggestionElements[selectedIndex]) {
        suggestionElements[selectedIndex].scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  /**
   * When a suggestion is clicked, select it:
   * - sets input text to suggestion's name
   * - hides autocomplete dropdown
   */
  function handleSuggestionClick(selectedObject: ObjectItem) {
    console.log(selectedObject);
    setInputValue(selectedObject.name);
    setIsAutocomplete(false);
  }

  /**
   * When input is focused, clear edit mode and show autocomplete if input > 1 char.
   * Also selects all current text for easy replacement.
   */
  function handleInputFocus(event: React.FocusEvent<HTMLInputElement>) {
    setIsEditMode(false);

    if (inputValue.length > 1) {
      setIsAutocomplete(true);
    }
    event.currentTarget.select(); // select all text inside input on focus
  }

  /**
   * When input loses focus, hide autocomplete and reset selection index.
   */
  function handleInputBlur() {
    setIsAutocomplete(false);
    setSelectedIndex(-1);
  }

  /**
   * Handles clicking the search button or submitting a search:
   * - Finds exact object match ignoring case and whitespace
   * - Navigates to that object if found
   * - Shows error if not found
   * - Special test input "Test" triggers a navigation test sequence
   */
  async function handleSearch(inputValue: string) {
    const matchingObject = objects.find(
      (obj) => obj.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    if (matchingObject) {
      // Uncomment when GA4 is ready
      /* trackEvent("Search", {
        room_name: matchingObject.name,
      }); */
      toast.dismiss(); // clear any previous toasts
      navigateToObject(
        matchingObject.name,
        navigation,
        setNavigation,
        setCurrentFloor,
        currentFloor
      );
      setSelectedIndex(-1);
    } 
    else {
      // Special case for testing navigation with input "Test"
      if (inputValue === "Test") {
        const delay = 500;
        navigationTestAll(
          objects,
          0,
          delay,
          navigation,
          setNavigation,
          setCurrentFloor,
          currentFloor
        );
        return;
      } else {
        // Show invalid input animation / state
        setIsInputInvalid(true);
        return;
      }
    }
  }

  // --------------------------
  // JSX to render the search bar UI:
  // --------------------------
  return (
    <div className="md:w-80 w-full flex flex-row">
      <div className="flex flex-inline rounded w-full">
        {/* Left icon circle */}
        <div className="h-12 w-12 center flex-none rounded-l bg-white text-blue-500 text-[8px] ">
          <div className="w-full h-8 center border-gray-300 border-r">
            <FiCircle size={10} />
          </div>
        </div>

        {/* Input box with autocomplete dropdown */}
        <div className="flex w-full relative">
          <input
            className={`h-12 p-4 w-full flex-none text-gray-900 text-sm md:text-md ${
              isInputInvalid && "input-error"
            } `}
            placeholder="Search"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            ref={inputRef}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            onAnimationEnd={() => setIsInputInvalid(false)}
          />

          {/* Autocomplete dropdown suggestions */}
          {isAutocomplete && (
            <ul
              ref={suggestionsRef}
              className="absolute w-full z-10 mt-[3.25rem] bg-white rounded shadow-md max-h-60 h-min overflow-auto"
              key={"suggestions"}
            >
              {suggestions.length > 0 ? (
                suggestions.map((obj, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer p-2 border-t text-gray-600 hover:bg-gray-200 active:bg-gray-300 text-sm md:text-md ${
                      selectedIndex === index
                        ? "border-l-4 border-blue-500 bg-gray-200"
                        : ""
                    }`}
                    onMouseDown={() => handleSuggestionClick(obj)}
                  >
                    {obj.name}
                  </li>
                ))
              ) : (
                <li
                  className="p-2 text-gray-500 text-sm md:text-md"
                  key={"no-result"}
                >
                  No results found
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Search button with tooltip */}
        <div className="">
          <Tooltip content="Search" className="bg-blue-500">
            <button
              className="h-12 w-12 flex flex-none center justify-center rounded-r bg-blue-500 text-white"
              onClick={() => handleSearch(inputValue)}
              aria-label="search"
            >
              <FiNavigation size={22}/>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
