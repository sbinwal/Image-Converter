import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { FiUpload } from 'react-icons/fi'; // Import drag and drop icon from react-icons library

const App = () => {
    const [image, setImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImage({
                data: reader.result,
                name: file.name,
            });
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = () => {
        setImage(null);
    };

    const generatePDF = () => {
        if (!image) return;
        const doc = new jsPDF();
        doc.text(image.name, 10, 10);
        doc.addImage(image.data, 'JPEG', 10, 20, 180, 160);
        doc.save('converted_image.pdf');
    };

    const convertImage = (format) => {
        if (!image) return;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = image.data;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                const newImage = new File([blob], image.name.replace(/\.[^/.]+$/, `.${format.toLowerCase()}`));
                const url = URL.createObjectURL(newImage);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', newImage.name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, `image/${format.toLowerCase()}`);
        };
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4 mb-12">
                <div className="text-center text-5xl font-bold text-red-500 mb-8">
                    Image Converter
                </div>
                <div className="flex flex-col items-center justify-center mb-8">
                    <label htmlFor="image-upload" className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer mb-4">
                        <FiUpload className="mr-2" /> Upload Image
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <div className="text-gray-500 text-sm">or drag and drop an image here</div>
                </div>
             
                    <div className="text-center mb-8">
                        <div className="border-dashed border-2 border-gray-400 rounded-lg inline-block p-8 mb-4 w-full">
                        {image &&     <img src={image.data} alt={image.name} className="max-w-full" />}
                        </div>
                        <div className='flex gap-4'>
                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleDelete}>
                            Delete
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={generatePDF}>
                            Convert to PDF
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => convertImage('JPEG')}>
                            Convert to JPEG
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => convertImage('JPG')}>
                            Convert to JPG
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => convertImage('PNG')}>
                            Convert to PNG
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => convertImage('SVG')}>
                            Convert to SVG
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => convertImage('WEBP')}>
                            Convert to WEBP
                        </button>
                        </div>
                       
                    </div>
             
            </div>
            <div className='flex justify-center bg-black fixed bottom-0 left-0 right-0 p-5 text-white '>© 2024 Image Converter. All Rights Reserved | Managed by Sandeep</div>
        </div>
    );
};

export default App;
