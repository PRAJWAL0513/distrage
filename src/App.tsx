import React, { useState } from 'react';
import { HardDrive, Upload, Download, Link } from 'lucide-react';
import { storeFiles, retrieveFiles } from './lib/storage';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedCID, setUploadedCID] = useState<string>('');
  const [retrievedFile, setRetrievedFile] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cid = await storeFiles([selectedFile]);
      setUploadedCID(cid);
    } catch (err) {
      setError('Failed to upload file to IPFS');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieve = async () => {
    if (!uploadedCID) {
      setError('No CID available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await retrieveFiles(uploadedCID);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setRetrievedFile(url);
    } catch (err) {
      setError('Failed to retrieve file from IPFS');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <HardDrive className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Free IPFS Storage</h1>
          </div>

          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <span className="text-gray-600">
                  {selectedFile ? selectedFile.name : 'Click to select a file'}
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload to IPFS
              </button>

              <button
                onClick={handleRetrieve}
                disabled={!uploadedCID || loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Retrieve File
              </button>
            </div>

            {/* Status and Results */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center text-gray-600">
                Processing...
              </div>
            )}

            {uploadedCID && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700">
                  <Link className="w-5 h-5" />
                  <span className="font-medium">IPFS Link:</span>
                </div>
                <a 
                  href={`https://ipfs.io/ipfs/${uploadedCID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-sm text-blue-600 hover:text-blue-800 break-all"
                >
                  {`https://ipfs.io/ipfs/${uploadedCID}`}
                </a>
              </div>
            )}

            {retrievedFile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Retrieved File:</span>
                </div>
                <a
                  href={retrievedFile}
                  download={selectedFile?.name}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;