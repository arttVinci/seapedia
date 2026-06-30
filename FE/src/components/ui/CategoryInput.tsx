import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useCategories } from "../../hooks/queries/categories/useCategories";

interface CategoryInputProps {
  value: string[];
  onChange: (categories: string[]) => void;
}

export const CategoryInput: React.FC<CategoryInputProps> = ({ value = [], onChange }) => {
  const { data: availableCategories = [] } = useCategories();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = availableCategories.filter(
    (cat) =>
      cat.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(cat)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !value.includes(val)) {
        onChange([...value, val]);
        setInputValue("");
        setShowSuggestions(false);
      }
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeCategory = (catToRemove: string) => {
    onChange(value.filter((cat) => cat !== catToRemove));
  };

  const addCategory = (cat: string) => {
    if (!value.includes(cat)) {
      onChange([...value, cat]);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        {value.map((cat) => (
          <span
            key={cat}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-sm font-medium"
          >
            {cat}
            <button
              type="button"
              onClick={() => removeCategory(cat)}
              className="text-blue-600 hover:text-blue-900 focus:outline-none"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={value.length === 0 ? "Ketik lalu Enter..." : ""}
          className="flex-1 outline-none min-w-[120px] text-sm bg-transparent"
        />
      </div>

      {showSuggestions && (inputValue || filteredSuggestions.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {inputValue && !availableCategories.includes(inputValue.trim()) && !value.includes(inputValue.trim()) && (
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-blue-600 font-medium"
              onClick={() => addCategory(inputValue.trim())}
            >
              + Tambah "{inputValue.trim()}"
            </div>
          )}
          {filteredSuggestions.map((cat) => (
            <div
              key={cat}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => addCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
