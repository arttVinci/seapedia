import React, { useState } from "react";
import { X } from "lucide-react";
import { useCategories } from "../../hooks/queries/categories/useCategories";

interface CategoryInputProps {
  value: string[];
  onChange: (categories: string[]) => void;
}

export const CategoryInput: React.FC<CategoryInputProps> = ({ value = [], onChange }) => {
  const { data: availableCategories = [] } = useCategories();
  const [inputValue, setInputValue] = useState("");

  const safeCategories = Array.isArray(availableCategories) ? availableCategories : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !value.includes(val)) {
        onChange([...value, val]);
        setInputValue("");
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
    }
  };

  const unselectedCategories = safeCategories.filter((cat) => !value.includes(cat));

  return (
    <div className="flex flex-col gap-3">
      {/* Selected Categories */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
        </div>
      )}

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ketik kategori baru lalu Enter..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />

      {/* Available Categories */}
      {unselectedCategories.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Kategori Tersedia:</p>
          <div className="flex flex-wrap gap-2">
            {unselectedCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => addCategory(cat)}
                className="px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors text-xs font-medium"
              >
                + {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
