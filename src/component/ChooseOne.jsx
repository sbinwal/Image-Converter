import React, { useState } from 'react';
import ImageConverter from './ImageConverter';
import ImageCompressorComponent from './ImageCompressor';

const ChooseOne = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="text-center mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">What do you want to do with your image?</h2>
      <div className="mb-4">
        <button
          className={`mr-4 px-4 py-2 border rounded ${selectedOption === 'convert' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleOptionChange('convert')}
        >
          Convert Image
        </button>
        <button
          className={`px-4 py-2 border rounded ${selectedOption === 'compress' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleOptionChange('compress')}
        >
          Compress Image
        </button>
      </div>
      
      {selectedOption === 'convert' && <ImageConverter />}
      {selectedOption === 'compress' && <ImageCompressorComponent />}
    </div>
  );
};

export default ChooseOne;
