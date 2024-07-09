// src/components/SearchBar.js
import React from 'react';

const SearchBar = ({ searchTerm, handleSearchChange, Filters }) => {
  return (
    <div>
        <imput
        type="text"
        name="Nom"
        placeholder="Recherche par nom"
        value={Filters.name}
    />
    <input
      type="text"
      placeholder="Search contacts..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
    <input
      type="text"
      placeholder="email"
      value={searchTerm}
      onChange={handleSearchChange}
    />
    </div>
  );
};

export default SearchBar;
