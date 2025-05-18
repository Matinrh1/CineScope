"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faSearch,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { RippleButton } from "./RippleButton";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isGenrePath = pathname.startsWith("/genres/");
  const [scrollIndicatorHeight, setScrollIndicatorHeight] = useState(0);
  const [scrollIndicatorTop, setScrollIndicatorTop] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  type SearchResult = {
    id: number;
    title?: string;
    name?: string;
    media_type: "movie" | "person";
  };

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);

      if (scrolled) {
        setIsGenresOpen(false);
        setShowDropdown(false);
        if (inputRef.current === document.activeElement) {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (
      isScrolled &&
      inputRef.current &&
      document.activeElement === inputRef.current
    ) {
      inputRef.current.blur();
    }
  }, [isScrolled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsGenresOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsGenresOpen(false);
  }, [pathname]);

  const toggleGenresDrawer = () => {
    setIsGenresOpen((prev) => !prev);
  };

  const handleWheel = (e: WheelEvent) => {
    const el = dropdownListRef.current;
    if (el) {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight === scrollHeight;

      if ((e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) {
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    const el = dropdownListRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
      el.addEventListener("scroll", () => {
        const { scrollTop, scrollHeight, clientHeight } = el;
        const indicatorHeight = (clientHeight / scrollHeight) * clientHeight;
        const indicatorTop = (scrollTop / scrollHeight) * clientHeight;
        setScrollIndicatorHeight(indicatorHeight);
        setScrollIndicatorTop(indicatorTop);
      });
    }
    return () => {
      if (el) {
        el.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      const trimmedTerm = searchTerm.trim();

      if (!trimmedTerm) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const [moviesRes, peopleRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              trimmedTerm
            )}&api_key=${
              process.env.NEXT_PUBLIC_TMDB_API_KEY
            }&language=en-US&page=1`
          ),
          fetch(
            `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
              trimmedTerm
            )}&api_key=${
              process.env.NEXT_PUBLIC_TMDB_API_KEY
            }&language=en-US&page=1`
          ),
        ]);

        const moviesData = await moviesRes.json();
        const peopleData = await peopleRes.json();

        const movies: SearchResult[] = (moviesData.results || []).map(
          (m: { id: number; title: string }) => ({
            id: m.id,
            title: m.title,
            media_type: "movie",
          })
        );

        const people: SearchResult[] = (peopleData.results || []).map(
          (p: { id: number; name: string }) => ({
            id: p.id,
            name: p.name,
            media_type: "person",
          })
        );

        const combined: SearchResult[] = [
          ...movies.slice(0, 5),
          ...people.slice(0, 5), // top 5 people
          // remaining slots with movies
        ];
        setSearchResults(combined);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [searchTerm]);

  useEffect(() => {
    const isSearchPage = pathname.startsWith("/search");

    if (isSearchPage && searchTerm.trim() === "") {
      router.push("/");
    }
  }, [searchTerm, pathname]);

  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, []);

  return (
    <nav
      className={` w-full fixed z-20  lg:hover:bg-black  text-white lg:hover:py-4 hover:opacity-90 transition-all duration-300 ${
        isScrolled
          ? "lg:py-2 opacity-75 bg-black"
          : "py-2 lg:py-4 lg:bg-transparent"
      }`}
    >
      <div className="mx-2 sm:mx-5 flex justify-between items-center">
        <div className="flex">
          <button
            className="text-white cursor-pointer px-2 lg:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="text-lg sm:text-xl p-2 font-bold">
            <Link href="/">
              <button
                className={`relative text-white after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
              ${
                pathname === "/"
                  ? "lg:after:w-full"
                  : "after:w-0 hover:after:w-full"
              }
                `}
              >
                CineScope
              </button>
            </Link>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed top-0 left-0 w-full h-screen bg-black text-white p-4 z-50 overflow-hidden lg:hidden">
            <button
              className="text-white mb-4 text-2xl"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button> 

            <div className="flex flex-col space-y-8">
              <Link href="/">
                <span
                  className="text-white hover:text-gray-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </span>
              </Link>
              <Link href="/discover-movies">
                <span
                  className="text-white hover:text-gray-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Discover Movies
                </span>
              </Link>
              <Link href="/top-rated">
                <span
                  className="text-white hover:text-gray-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Top Rated
                </span>
              </Link>
              <Link href="/celebrities">
                <span
                  className="text-white hover:text-gray-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Celebrities
                </span>
              </Link>
            
              <div>
                <p className="text-lg text-gray-400 mb-3">Genres</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "action",
                    "adventure",
                    "animation",
                    "comedy",
                    "crime",
                    "documentary",
                    "drama",
                    "family",
                    "fantasy",
                    "history",
                    "horror",
                    "science fiction",
                    "music",
                    "mystery",
                    "romance",
                    "thriller",
                    "war",
                    "western",
                  ].map((genre) => (
                    <Link href={`/genres/${genre}`} key={genre}>
                      <span
                        className="capitalize text-white text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {genre}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="relative lg:hidden flex items-center group"
          ref={searchDropdownRef}
        >
          {!showSearchInput ? (
            <button
              onClick={() => setShowSearchInput(true)}
              className="text-white text-xl"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          ) : (
            <>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim() !== "") {
                  router.push(
                    `/search/${encodeURIComponent(searchTerm.trim())}`
                  );
                }
              }}
                // onBlur={() => {
                //   setTimeout(() => setShowSearchInput(false), 200);
                // }}
                placeholder="Search..."
                autoFocus
                className={`
           placeholder:text-white text-white rounded px-3 py-1 border-2 border-white focus:outline-none
          transition-all duration-300 w-40 sm:w-80 
        `}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute right-3 text-white pointer-events-none"
              />
            </>
          )}

          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-black text-white border border-gray-700 mt-1 rounded shadow-md z-50 max-h-80 overflow-y-auto">
              <ul>
                {searchResults.map((result) => (
                  <li
                    key={`${result.media_type}-${result.id}`}
                    className="block px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer"
                    onMouseDown={() => {
                      setShowDropdown(false);
                      setSearchTerm(result.title || result.name || "");
                      router.push(
                        `/search/${encodeURIComponent(
                          result.title || result.name || ""
                        )}`
                      );
                    }}
                  >
                    {result.media_type === "movie" ? (
                      <>🎬 {result.title}</>
                    ) : (
                      <>👤 {result.name}</>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-6 ">
          <div
            className="relative flex items-center group"
            ref={searchDropdownRef}
          >
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim() !== "") {
                  router.push(
                    `/search/${encodeURIComponent(searchTerm.trim())}`
                  );
                }
              }}
              placeholder="Search..."
              className={`
                      rounded-sm py-1 ring-1 ring-black  placeholder-transparent group-hover:placeholder-gray-400  hover:ring-white text-white focus:outline-none  
                       transition-all duration-300
                           ${
                             isScrolled
                               ? " pl-4 pr-10 "
                               : "pl-10 pr-4 ring-transparent"
                           }
                     group-hover:pl-10 group-hover:pr-4
                         `}
            />
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-black text-white border border-gray-700 mt-1 rounded shadow-md z-50 max-h-80 overflow-y-auto">
                <ul>
                  {searchResults.map((result) => (
                    <li
                      key={`${result.media_type}-${result.id}`}
                      className="block px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => {
                        setShowDropdown(false);
                        setSearchTerm(result.title || result.name || "");
                        router.push(
                          `/search/${encodeURIComponent(
                            result.title || result.name || ""
                          )}`
                        );
                      }}
                    >
                      {result.media_type === "movie" ? (
                        <>🎬 {result.title}</>
                      ) : (
                        <>👤 {result.name}</>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <FontAwesomeIcon
              icon={faSearch}
              className={`absolute pt-[1px]  right-3 group-hover:left-3 transition-all duration-300`}
            />
          </div>
          <Link href="/discover-movies">
            <button
              className={`relative text-white after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
                ${
                  pathname === "/discover-movies"
                    ? "after:w-full"
                    : "after:w-0 hover:after:w-full"
                }
                 `}
            >
              Discover Movies
            </button>
          </Link>

          <Link href="/top-rated">
            <button
              className={`relative text-white after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
            ${
              pathname === "/top-rated"
                ? "after:w-full"
                : "after:w-0 hover:after:w-full"
            }
                   `}
            >
              Top Rated Movies
            </button>
          </Link>

          <Link href="/celebrities">
            <button
              className={`relative text-white after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
                ${
                  pathname === "/celebrities"
                    ? "after:w-full"
                    : "after:w-0 hover:after:w-full"
                }
                  `}
            >
              Celebrities
            </button>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              className={`relative text-white after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
              ${
                isGenresOpen || isGenrePath
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
              }
                 flex items-center
                      `}
              onClick={toggleGenresDrawer}
            >
              Movie Genres
              <FontAwesomeIcon
                icon={faAngleDown}
                className={`ml-2 transition-transform duration-200 ${
                  isGenresOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute left-0 mt-2 w-50 bg-slate-950 text-white rounded-sm shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform ${
                isGenresOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div
                className="absolute left-0 top-0 w-1 bg-gray-600 rounded-l-md"
                style={{
                  height: `${scrollIndicatorHeight}px`,
                  top: `${scrollIndicatorTop}px`,
                }}
              ></div>

              <ul
                ref={dropdownListRef}
                className="max-h-80 overflow-y-auto border border-gray-700 rounded-md shadow-md scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              >
                {[
                  "action",
                  "adventure",
                  "animation",
                  "comedy",
                  "crime",
                  "documentary",
                  "drama",
                  "family",
                  "fantasy",
                  "history",
                  "horror",
                  "science fiction",
                  "music",
                  "mystery",
                  "romance",
                  "thriller",
                  "war",
                  "western",
                ].map((genre) => (
                  <li key={genre}>
                    <Link href={`/genres/${genre}`}>
                      <RippleButton className="block w-full px-4 py-2 text-left text-white capitalize hover:bg-gray-800 focus:outline-none">
                        {genre}
                      </RippleButton>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
