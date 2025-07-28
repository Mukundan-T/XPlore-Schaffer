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
import apiService from "@/services/apiService";
import { getCurrentLocation } from "@/store/currentLocation";
import { toast } from "react-toastify";

function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("");
  const { objects } = useContext(MapDataContext) as MapDataContextType;
  const [suggestions, setSuggestions] = useState<ObjectItem[]>(objects);
  const [isAutocomplete, setIsAutocomplete] = useState<boolean>(false);
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigation, setNavigation } = useContext(
    NavigationContext
  ) as NavigationContextType;
  const { setIsEditMode } = useContext(
    NavigationContext
  ) as NavigationContextType;
  const { currentFloor, setCurrentFloor } = useFloor();

  useEffect(() => {
    setSuggestions(objects);
  }, [objects]);

  useOnClickOutside(suggestionsRef, () => {
    setIsAutocomplete(false);
    setIsEditMode(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  });

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

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);
    if (value) {
      setIsAutocomplete(true);

      const filteredNames = objects.filter((obj) =>
        obj.name.toLowerCase().includes(value.trim().toLowerCase())
      );
      const filteredDescs = objects.filter((obj) =>
        obj.desc.toLowerCase().includes(value.trim().toLowerCase())
      );
      const allSuggestions: ObjectItem[] = filteredNames.concat(filteredDescs);
      const filteredSuggestions = removeDuplicates(allSuggestions, "name");

      setSuggestions(filteredSuggestions);
    } else {
      setIsAutocomplete(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (isAutocomplete) {
      if (event.key === "ArrowDown") {
        if (selectedIndex < suggestions.length - 1) {
          setSelectedIndex((prevIndex) => prevIndex + 1);
          setInputValue(suggestions[selectedIndex + 1].name);
        }
        event.preventDefault();
      } else if (event.key === "ArrowUp") {
        if (selectedIndex > 0) {
          setSelectedIndex((prevIndex) => prevIndex - 1);
          setInputValue(suggestions[selectedIndex - 1].name);
        }
        event.preventDefault();
      } else if (event.key === "Enter" && selectedIndex >= 0) {
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

  function handleSuggestionClick(selectedObject: ObjectItem) {
    console.log(selectedObject);
    setInputValue(selectedObject.name);
    setIsAutocomplete(false);
  }
  function handleInputFocus(event: React.FocusEvent<HTMLInputElement>) {
    setIsEditMode(false);

    if (inputValue.length > 1) {
      setIsAutocomplete(true);
    }
    event.currentTarget.select();
  }

  function handleInputBlur() {
    setIsAutocomplete(false);
    setSelectedIndex(-1);
  }

  async function handleSearch(inputValue: string) {
    const matchingObject = objects.find(
      (obj) => obj.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    if (matchingObject) {
      // Could be place to increment a counter for user clicks - search bar
      try {
      // Log search to the backend
        await apiService.post("/searches", {
          query: matchingObject.name,
          userLocation: getCurrentLocation()
        });
      }
      catch (err) {
        console.error("Error logging search:", err);
      }
      toast.dismiss();
      navigateToObject(matchingObject.name, navigation, setNavigation, setCurrentFloor, currentFloor);
      setSelectedIndex(-1);
    }
    else {
      //? To test the navigation feature
      if (inputValue === "Test") {
        const delay = 500;
        navigationTestAll(objects, 0, delay, navigation, setNavigation, setCurrentFloor, currentFloor);
        return;
      } else {
        setIsInputInvalid(true);
        return;
      }
    }
  }

  return (
    <div className="md:w-80 w-full flex flex-row">
      <div className="flex flex-inline rounded w-full">
        <div className="h-12 w-12 center flex-none rounded-l bg-white text-blue-500 text-[8px] ">
          <div className="w-full h-8 center border-gray-300 border-r">
            <FiCircle size={10}/>
          </div>
        </div>
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

        <div className="">
          <Tooltip content="Search" className="bg-blue-500">
            <button
              className="h-12 w-12 flex flex-none center justify-center rounded-r bg-blue-500 text-white"
              onClick={() => handleSearch(inputValue)}
              aria-label="search"
            >
              <FiNavigation size={20}/>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
