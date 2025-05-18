//D:\js\next.js\cinescope\src\app\components\GenreToolbar.tsx
"use client";

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type GenreToolbarProps = {
  title: string;
  sortBy: string;
  onSortChange: (value: string) => void;
};

const sortOptions = [
  { label: "Most Popular", value: "popularity.desc" }, 
  { label: "Most Voted", value: "vote_count.desc" }, 
  { label: "Top Rated", value: "vote_average.desc" },
  { label: "New to Old", value: "primary_release_date.desc" }, 
  { label: "Old to New", value: "primary_release_date.asc" }, 
];

export default function GenreToolbar({ title, sortBy, onSortChange }: GenreToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl capitalize text-white px-2 sm:px-5 sm:text-3xl font-bold py-5 mb-4">
        {title}
      </h2>
      <div className="flex pr-1 sm:pr-5 lg:pr-8 justify-end mb-4">
        <div className="relative inline-block text-white">
          <label
            htmlFor="sort"
            className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-black z-10"
          >
            Sort by
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-black text-white border border-zinc-700 hover:border-white rounded-md px-4 py-2 pl-3 pr-10 focus:outline-none focus:ring-1 focus:ring-white transition duration-150 ease-in-out"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
            <FontAwesomeIcon icon={faAngleDown} className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
