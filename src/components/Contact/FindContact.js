import React, { useState } from 'react';
import SearchBar from './SearchBar'; // Assurez-vous que le chemin vers SearchBar est correct

const FindContact = () => {
  const initialFilters = { nom: '', prénom: '', category: '' };
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    console.log(`Changing filter ${name} to ${value}`);
    setFilters({
      ...filters,
      [name]: value
    });
  };
  const handleSearch = () => {
    // Logique pour la recherche de contacts avec les filtres
    console.log('Recherche avec les filtres:', filters);
  };

  return (
    <div>
      <h1>Recherche de Contacts</h1>
      <SearchBar
      filters={filters} 
      handleFilterChange={handleFilterChange} 
      handleSearch={handleSearch}/>
      {/* Autres composants ou logique de rendu */}
    </div>
  );
};

export default FindContact;
