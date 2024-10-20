// src/component/DepreciationCalculator.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

const DepreciationCalculator = () => {
  const [initialValue, setInitialValue] = useState('');
  const [salvageValue, setSalvageValue] = useState('');
  const [lifeSpan, setLifeSpan] = useState('');
  const [depreciationRate, setDepreciationRate] = useState('');
  const [slmDepreciation, setSlmDepreciation] = useState(null);
  const [wdbDepreciation, setWdbDepreciation] = useState([]);

  // Calculate SLM Depreciation
  const calculateSLM = () => {
    const value = parseFloat(initialValue);
    const salvage = parseFloat(salvageValue);
    const life = parseFloat(lifeSpan);

    if (!isNaN(value) && !isNaN(salvage) && !isNaN(life)) {
      const slmDep = (value - salvage) / life;
      setSlmDepreciation(slmDep.toFixed(2));
    } else {
      alert("Please enter valid numbers for SLM calculation!");
    }
  };

  // Calculate WDB Depreciation
  const calculateWDB = () => {
    const value = parseFloat(initialValue);
    const rate = parseFloat(depreciationRate) / 100;

    if (!isNaN(value) && !isNaN(rate)) {
      let currentValue = value;
      const depreciationArray = [];

      for (let year = 1; year <= lifeSpan; year++) {
        const depreciation = currentValue * rate;
        currentValue -= depreciation;
        depreciationArray.push({ year, depreciation: depreciation.toFixed(2), bookValue: currentValue.toFixed(2) });
      }
      setWdbDepreciation(depreciationArray);
    } else {
      alert("Please enter valid numbers for WDB calculation!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-4 flex items-center">
        <FontAwesomeIcon icon={faCalculator} className="text-blue-600 mr-2" />
        Depreciation Calculator
      </h2>
      <div className="mb-4">
        <label className="block mb-1">Initial Value:</label>
        <input
          type="number"
          value={initialValue}
          onChange={(e) => setInitialValue(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full"
          placeholder="Enter initial value"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Salvage Value:</label>
        <input
          type="number"
          value={salvageValue}
          onChange={(e) => setSalvageValue(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full"
          placeholder="Enter salvage value"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Useful Life (years):</label>
        <input
          type="number"
          value={lifeSpan}
          onChange={(e) => setLifeSpan(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full"
          placeholder="Enter useful life in years"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Depreciation Rate (%):</label>
        <input
          type="number"
          value={depreciationRate}
          onChange={(e) => setDepreciationRate(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full"
          placeholder="Enter depreciation rate"
        />
      </div>
      <div className="flex mb-4">
        <button
          onClick={calculateWDB}
          className="bg-blue-600 text-white p-3 rounded flex-1 mr-2 hover:bg-blue-700 transition duration-300"
        >
          Calculate WDB
        </button>
        <button
          onClick={calculateSLM}
          className="bg-green-600 text-white p-3 rounded flex-1 hover:bg-green-700 transition duration-300"
        >
          Calculate SLM
        </button>
      </div>

      {/* SLM Result */}
      {slmDepreciation !== null && (
        <div className="mt-4 bg-gray-100 p-4 rounded border border-gray-300">
          <h3 className="font-bold">SLM Depreciation: <span className="text-blue-600">{slmDepreciation}</span></h3>
        </div>
      )}

      {/* WDB Result */}
      {wdbDepreciation.length > 0 && (
        <div className="mt-4 bg-gray-100 p-4 rounded border border-gray-300">
          <h3 className="font-bold">WDV Depreciation Schedule:</h3>
          <table className="mt-2 border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Year</th>
                <th className="border border-gray-300 p-2">Depreciation</th>
                <th className="border border-gray-300 p-2">Book Value</th>
              </tr>
            </thead>
            <tbody>
              {wdbDepreciation.map(item => (
                <tr key={item.year}>
                  <td className="border border-gray-300 p-2 text-center">{item.year}</td>
                  <td className="border border-gray-300 p-2 text-center">{item.depreciation}</td>
                  <td className="border border-gray-300 p-2 text-center">{item.bookValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DepreciationCalculator;
