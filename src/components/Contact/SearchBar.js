// src/components/SearchBar.js
import React from 'react';

const SearchBar = ({ handleSearchChange, Filters }) => {
  return (
    <div>
        <imput
        type="text"
        name="Nom"
        placeholder="Recherche par nom"
        value={Filters.nom}
        onChange={handleFilterchange}
    />
    <input
      type="text"
      name="Prénom"
      placeholder="Recherche par prénom"
      value={Filters.prénom}
      onChange={handlefiterChange}
    />
    <select name="category" value={filters.category} onChange={handleFilterChange}>
        <option value="">All Categories</option>
        <option value="Family">Family</option>
        <option value="Friends">Friends</option>
        <option value="Work">Work</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
};

export default SearchBar;
