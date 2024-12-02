import React, { useState } from 'react';

const categories = [
  'T-Shirts',
  'Shirts',
  'Jeans',
  'Jackets',
  'Sweaters',
  'Shoes',
  'Accessories',
  'Hats',
  'Belts',
  'Socks',
  'Shorts',
  'Pants',
];

function CategorySelector() {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Select Categories</h2>
      <form className="grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center space-x-2 cursor-pointer bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition"
          >
            <input
              type="checkbox"
              value={category}
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-gray-700 font-medium">{category}</span>
          </label>
        ))}
      </form>
      
    </div>
  );
}

export default CategorySelector;
