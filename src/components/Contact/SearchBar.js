import React from 'react';
import './SearchBar.css';

const SearchBar = ({ handleFilterChange, filters }) => {
  if (!filters) {
    return null;
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        name="nom"
        placeholder="Recherche par nom"
        value={filters.nom}
        onChange={handleFilterChange}
      />
      <input
        type="text"
        name="prénom"
        placeholder="Recherche par prénom"
        value={filters.prénom}
        onChange={handleFilterChange}
      />
      <select
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
      >
        <option value="">Toutes les catégories</option>
        <option value="Family">Famille</option>
        <option value="Friends">Amis</option>
        <option value="Work">Travail</option>
        <option value="Other">Autre</option>
      </select>
      <button type="button">Rechercher</button>
    </div>
  );
};

export default SearchBar;
