import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post("http://localhost:3000/bfhl", parsedInput);
      setResponse(res.data);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON input. Please check your input and try again.");
      } else if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(
            `Server error: ${err.response.status} ${err.response.statusText}`
          );
        } else if (err.request) {
          setError(
            "No response received from the server. Please check if the server is running."
          );
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    const selectedFields = selectedOptions.map((option) => option.value);

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        {selectedFields.includes("numbers") && (
          <p className="mb-2">
            <span className="font-semibold">Numbers:</span>{" "}
            {response.numbers.length > 0
              ? response.numbers.join(", ")
              : "No numbers"}
          </p>
        )}
        {selectedFields.includes("alphabets") && (
          <>
            <p className="mb-2">
              <span className="font-semibold">Alphabets:</span>{" "}
              {response.alphabets.length > 0
                ? response.alphabets.join(", ")
                : "No alphabets"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Highest Lowercase Alphabet:</span>{" "}
              {response.highest_lowercase_alphabet.length > 0
                ? response.highest_lowercase_alphabet.join(", ")
                : "No lowercase alphabets"}
            </p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
          Your Roll Number
        </h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter JSON input"
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 resize-none h-32"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          >
            Submit
          </button>
        </form>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {response && (
          <div className="mb-6">
            <Select
              isMulti
              options={options}
              onChange={setSelectedOptions}
              placeholder="Select fields to display"
              className="text-gray-700"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: "#3B82F6",
                  "&:hover": {
                    borderColor: "#2563EB",
                  },
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#BFDBFE",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "#1E40AF",
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  color: "#1E40AF",
                  "&:hover": {
                    backgroundColor: "#93C5FD",
                    color: "#1E3A8A",
                  },
                }),
              }}
            />
          </div>
        )}
        {renderResponse()}
      </div>
    </div>
  );
}

export default App;
