import React, { useState, useEffect } from "react";
import supabase from "./supabaseClient";
import { useNavigate } from "react-router-dom";

const SearchPageAarti = ({ selectedLanguage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === "") {
        setResults([]);
        return;
      }
      const { data, error } = await supabase
        .from("aartis")
        .select("*")
        .ilike("aarti", `%${searchTerm}%`);

      if (error) {
        console.error("Error fetching search results:", error);
      } else {
        setResults(data);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleResultClick = (aartiId) => {
    navigate(`/aarti/${aartiId}`);
  };

  return (
    <div className="search-page">
      <input
        type="text"
        placeholder="Search for aartis..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="search-results">
        {results.map((result) => (
          <div
            key={result.id}
            className="search-result-item"
            onClick={() => handleResultClick(result.id)}
          >
            <img
              src={result.aarti_image_url}
              alt={result.aarti}
              className="search-result-image"
            />
            <div className="search-result-info">
              <div className="search-result-title">{result.aarti}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPageAarti;
