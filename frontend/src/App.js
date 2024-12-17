import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import pict from './assets/flowergirls.png'
import sunflower from './assets/sunflower.svg'
import tulip from './assets/tulip.svg'
import rose from './assets/rose.svg'
import daisy from './assets/daisy.svg'
import dandelion from './assets/dandelion.svg'
import './App.css'
import { IoMdArrowDown } from "react-icons/io";


const App = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [fileName, setFileName] = useState("");

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setFile(file);
        setFileName(file.name);

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
    
            try {
                const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setResult(response.data);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const flowerImages = {
        sunflower: sunflower,
        tulip: tulip,
        rose: rose,
        daisy: daisy,
        dandelion: dandelion,
    };

    return (
        <div>
            <Navbar/>
            <div className="h-screen bg-white flex" id="1">
                <div className="w-1/2 flex items-center justify-center py-8">
                    <div className="pl-24 font-yeseva">
                        <div className="text-left font-semibold text-[#56a785] text-4xl ">Dandelion, Daisy, Sunflower, Tulip and Rose</div>
                        <div className="py-4 text-left font-normal text-[#224335]">Upload your flower photo now, and find out if it matches one of these type!</div>
                        <div className="mt-6 flex items-center bg-[#f9a102] text-white hover:bg-[#fbd302] active:bg-[#f9a102]  px-4 py-2 rounded-full shadow-lg w-fit">
                            <a href="#2">Start Now!</a>
                            <IoMdArrowDown/>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 flex justify-center items-center">
                    <img className="w-1/2" src={pict}/>
                </div>
            </div>
            <div className="flex items-center font-yeseva w-full h-screen" id="2">
                <div
                    className={`h-full bg-white flex items-center justify-center transition-all duration-500 ${
                        result ? "w-1/2" : "w-full"
                    }`}
                >
                    <div className="flex items-center justify-center w-2/3">
                        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-2/3 space-y-4">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        setFile(file);
                                        setFileName(file.name);

                                        const formData = new FormData();
                                        formData.append("file", file);

                                        axios
                                            .post("http://127.0.0.1:5000/predict", formData, {
                                                headers: { "Content-Type": "multipart/form-data" },
                                            })
                                            .then((response) => {
                                                setResult(response.data);
                                            })
                                            .catch((error) => {
                                                console.error("Error uploading file:", error);
                                            });
                                    }
                                }}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">{fileName || "Click to upload"}</span>
                                        {!file && " or drag and drop"}
                                    </p>
                                    {!file && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            SVG, PNG, JPG
                                        </p>
                                    )}
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </form>
                    </div>
                </div>
                {result && (
                    <div className="w-1/2 h-full bg-white flex flex-col items-center justify-center">
                        <div id="flip-card">
                            <div id="flip-card-inner">
                                <div id="flip-card-front">
                                    <p id="title">{result.score <= 1 ? (result.score * 100).toFixed(2) : result.score.toFixed(2)}%</p>
                                    <p id="title" className="uppercase">
                                        {result.flower}
                                    </p>
                                    <p className="text-sm font-extralight">Hover Me</p>
                                </div>
                                <div id="flip-card-back" className="flex flex-col justify-center items-center">
                                    <p className="text-[#56a785] w-full text-center">Hello! I'm {result.flower}</p>
                                    <img
                                        src={flowerImages[result.flower]}
                                        alt={result.flower}
                                        className="w-full h-auto bottom-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default App;
