import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faDownload, faUpload, faQuestionCircle, faHistory } from '@fortawesome/free-solid-svg-icons';
import { compress } from 'image-conversion';

function ImageCompressorComponent() {
    const [compressedLink, setCompressedLink] = useState('');
    const [originalImage, setOriginalImage] = useState(null);
    const [originalLink, setOriginalLink] = useState('');
    const [uploadImage, setUploadImage] = useState(false);
    const [outputFileName, setOutputFileName] = useState('');
    const [compressionQuality, setCompressionQuality] = useState(0.8);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [isCompressed, setIsCompressed] = useState(false);
    const [compressionInProgress, setCompressionInProgress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [compressedHistory, setCompressedHistory] = useState([]);
    const [showCompressedImage, setShowCompressedImage] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        if (originalImage) {
            setCompressedLink('');
            setCompressedSize(0);
            setIsCompressed(false);
            setShowCompressedImage(false);
        }
    }, [originalImage]);

    async function uploadLink(event) {
        const imageFile = event.target.files[0];
        setOriginalLink(URL.createObjectURL(imageFile));
        setOriginalImage(imageFile);
        setOutputFileName(imageFile.name);
        setUploadImage(true);
        setOriginalSize(imageFile.size);
    }

    async function compressImage() {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }

        try {
            setCompressionInProgress(true);
            setShowCompressedImage(false);
            setLoading(true);

            const compressedImage = await compress(originalImage, {
                quality: compressionQuality,
                width: originalImage.width,
                height: originalImage.height,
            });

            setCompressedLink(URL.createObjectURL(compressedImage));
            setCompressedSize(compressedImage.size);
            setIsCompressed(true);

            setCompressedHistory([
                ...compressedHistory,
                {
                    link: compressedLink,
                    name: outputFileName
                }
            ]);

            setTimeout(() => {
                setLoading(false);
                setShowCompressedImage(true);
            }, 2000);
        } catch (error) {
            console.error('Image compression failed:', error);
            alert('Image compression failed. Please try again.');
        } finally {
            setCompressionInProgress(false);
        }
    }

    function resetApp() {
        setOriginalLink('');
        setOriginalImage(null);
        setUploadImage(false);
        setOutputFileName('');
        setCompressionQuality(0.8);
        setOriginalSize(0);
        setCompressedSize(0);
        setIsCompressed(false);
        setCompressedLink('');
        setShowCompressedImage(false);
    }

    function toggleHelp() {
        setShowHelp(!showHelp);
    }

    function toggleHistory() {
        setShowHistory(!showHistory);
    }

    return (
        <div className="mainContainer bg-gray-100 min-h-screen py-8">
            <div className="max-w-4xl mx-auto">
                <nav className="flex justify-between items-center bg-red-300 py-4 px-6 rounded-md shadow-md mb-8">
                    <div>
                        <h1 className="text-xl font-bold flex items-center">
                            <FontAwesomeIcon icon={faImage} className="mr-2" />
                            Webkuu Image Compressor
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FontAwesomeIcon icon={faQuestionCircle} className="text-xl cursor-pointer" onClick={toggleHelp} />
                        <FontAwesomeIcon icon={faHistory} className="text-xl cursor-pointer" onClick={toggleHistory} />
                    </div>
                </nav>

                {showHelp && (
                    <div className="bg-white p-4 rounded-md shadow-md mb-8">
                        <p className="font-semibold mb-2">Instructions:</p>
                        <ul className="list-disc list-inside">
                            <li>Upload an image using the "Upload a file" button.</li>
                            <li>Adjust the compression quality using the slider.</li>
                            <li>Press the "Compress" button to start the compression.</li>
                            <li>Download the compressed image using the "Download" button.</li>
                        </ul>
                    </div>
                )}

                {showHistory && (
                    <div className="bg-white p-4 rounded-md shadow-md mb-8">
                        <p className="font-semibold mb-2">Compressed History:</p>
                        <ul className="list-disc list-inside">
                            {compressedHistory.map((item, index) => (
                                <li key={index}>
                                    <a href={item.link} download={item.name}>{item.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex justify-center items-center space-x-8">
                    <div className="flex flex-col items-center space-y-4">
                        {uploadImage ? (
                            <img src={originalLink} alt="Original Image" className="rounded-md shadow-md" style={{ maxWidth: '200px' }} />
                        ) : (
                            <div className="bg-gray-200 w-full h-20 flex justify-center items-center rounded-md shadow-md">
                                <FontAwesomeIcon icon={faUpload} className="text-4xl text-gray-500" />
                            </div>
                        )}

                        <div className="relative">
                            <label htmlFor="uploadBtn" className="btn bg-blue-600 w-full text-center p-2 rounded hover:bg-blue-700 cursor-pointer">
                                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                                Upload a file
                            </label>
                            <input type="file" id="uploadBtn" accept="image/*" className="hidden" onChange={uploadLink} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center space-y-4">
                        {outputFileName && (
                            <div>
                                <label htmlFor="qualitySlider" className="font-semibold">Compression Quality:</label>
                                <input
                                    id="qualitySlider"
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.1"
                                    value={compressionQuality}
                                    onChange={(event) => setCompressionQuality(parseFloat(event.target.value))}
                                    className="block w-full"
                                />
                                <div className="text-center">
                                    Original Size: {Math.round(originalSize / 1024)} KB <br />
                                    Compressed Size: {Math.round(compressedSize / 1024)} KB
                                </div>
                                <div className="text-center">
                                    {isCompressed && !compressionInProgress && (
                                        <div className="text-green-600 font-semibold">Image compressed successfully!</div>
                                    )}
                                    {compressionInProgress && <div className="text-blue-600">Compressing image...</div>}
                                </div>
                                <div className="flex items-center space-x-4">
                                    {loading ? (
                                        <div className="text-blue-600">Loading...</div>
                                    ) : (
                                        <button type="button" className="btn bg-green-600 p-1 rounded hover:bg-green-700" onClick={compressImage}>
                                            <FontAwesomeIcon icon={faImage} className="mr-2" />
                                            Compress
                                        </button>
                                    )}
                                    <button type="button" className="btn bg-red-600 p-1 rounded hover:bg-red-700" onClick={resetApp}>Reset</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        {showCompressedImage && (
                            <div>
                                <img src={compressedLink} alt="Compressed Image" className="rounded-md shadow-md" style={{ maxWidth: '200px' }} />
                                <a href={compressedLink} download={outputFileName} className="btn bg-green-600 w-full p-2 rounded hover:bg-green-700">
                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                    Download
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageCompressorComponent;
