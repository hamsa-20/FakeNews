// import React, { useState, useRef } from 'react';
// import { Send, FileText, Trash2, Upload, Image, FileUp, X } from 'lucide-react';
// import { analyzeNews } from '../../services/api';
// import './NewsInput.css';

// const NewsInput = ({ onAnalysis, onLoading, onError, onReset }) => {
//   const [newsText, setNewsText] = useState('');
//   const [selectedModels, setSelectedModels] = useState(['twitter', 'mediaeval', 'socialcontext']);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef(null);

//   const models = [
//     { id: 'twitter', name: 'Twitter Model', description: 'Trained on Twitter data' },
//     { id: 'mediaeval', name: 'MediaEval Model', description: 'MediaEval benchmark dataset' },
//     { id: 'socialcontext', name: 'Social Context Model', description: 'Social context analysis' }
//   ];

//   const acceptedFileTypes = {
//     images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
//     documents: ['.pdf', '.doc', '.docx', '.txt'],
//     videos: ['.mp4', '.avi', '.mov', '.wmv', '.flv']
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     const files = Array.from(e.dataTransfer.files);
//     handleFileSelection(files);
//   };

//   const handleFileInput = (e) => {
//     const files = Array.from(e.target.files);
//     handleFileSelection(files);
//   };

//   const handleFileSelection = (files) => {
//     const validFiles = files.filter(file => {
//       const extension = '.' + file.name.split('.').pop().toLowerCase();
//       const allAccepted = [...acceptedFileTypes.images, ...acceptedFileTypes.documents, ...acceptedFileTypes.videos];
//       return allAccepted.includes(extension);
//     });

//     if (validFiles.length !== files.length) {
//       onError('Some files were rejected. Please upload images, documents, or videos only.');
//     }

//     const newFiles = validFiles.map(file => ({
//       file,
//       id: Date.now() + Math.random(),
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
//     }));

//     setUploadedFiles(prev => [...prev, ...newFiles]);
//   };

//   const removeFile = (fileId) => {
//     setUploadedFiles(prev => {
//       const fileToRemove = prev.find(f => f.id === fileId);
//       if (fileToRemove?.preview) {
//         URL.revokeObjectURL(fileToRemove.preview);
//       }
//       return prev.filter(f => f.id !== fileId);
//     });
//   };

//   const getFileIcon = (fileName) => {
//     const extension = fileName.split('.').pop().toLowerCase();
//     if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
//       return <Image className="file-icon" />;
//     }
//     return <FileUp className="file-icon" />;
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!newsText.trim() && uploadedFiles.length === 0) {
//       onError('Please enter some text or upload files to analyze');
//       return;
//     }

//     if (selectedModels.length === 0) {
//       onError('Please select at least one model for analysis');
//       return;
//     }

//     onLoading(true);
//     onError(null);

//     try {
//       const formData = new FormData();
//       formData.append('text', newsText);
//       formData.append('models', JSON.stringify(selectedModels));
      
//       uploadedFiles.forEach((fileObj, index) => {
//         formData.append('files', fileObj.file);
//       });

//       const results = await analyzeNews(formData, selectedModels, true); // multimodal flag
//       onAnalysis(results);
//     } catch (error) {
//       onError(error.message);
//     } finally {
//       onLoading(false);
//     }
//   };

//   const handleModelToggle = (modelId) => {
//     setSelectedModels(prev => 
//       prev.includes(modelId)
//         ? prev.filter(id => id !== modelId)
//         : [...prev, modelId]
//     );
//   };

//   const handleClear = () => {
//     setNewsText('');
//     uploadedFiles.forEach(fileObj => {
//       if (fileObj.preview) {
//         URL.revokeObjectURL(fileObj.preview);
//       }
//     });
//     setUploadedFiles([]);
//     onReset();
//   };

//   return (
//     <div className="news-input">
//       <div className="input-header">
//         <FileText className="input-icon" />
//         <h2>Multi-Modal Fake News Analysis</h2>
//       </div>

//       <form onSubmit={handleSubmit} className="input-form">
//         {/* Text Input Section */}
//         <div className="textarea-container">
//           <textarea
//             value={newsText}
//             onChange={(e) => setNewsText(e.target.value)}
//             placeholder="Paste the news article or text you want to verify for authenticity..."
//             className="news-textarea"
//             rows={6}
//           />
//           <div className="char-count">
//             {newsText.length} characters
//           </div>
//         </div>

//         {/* File Upload Section */}
//         <div className="upload-section">
//           <h3>Upload Files (Images, Documents, Videos)</h3>
          
//           <div 
//             className={`upload-area ${dragActive ? 'drag-active' : ''}`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Upload className="upload-icon" />
//             <p>Drag & drop files here or click to browse</p>
//             <p className="upload-hint">Supports: Images, PDFs, Documents, Videos</p>
            
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               onChange={handleFileInput}
//               accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.doc,.docx,.txt,.mp4,.avi,.mov,.wmv,.flv"
//               className="file-input-hidden"
//             />
//           </div>

//           {/* Uploaded Files Display */}
//           {uploadedFiles.length > 0 && (
//             <div className="uploaded-files">
//               <h4>Uploaded Files ({uploadedFiles.length})</h4>
//               <div className="files-grid">
//                 {uploadedFiles.map(fileObj => (
//                   <div key={fileObj.id} className="file-item">
//                     {fileObj.preview ? (
//                       <img src={fileObj.preview} alt={fileObj.name} className="file-preview" />
//                     ) : (
//                       <div className="file-icon-container">
//                         {getFileIcon(fileObj.name)}
//                       </div>
//                     )}
//                     <div className="file-info">
//                       <span className="file-name">{fileObj.name}</span>
//                       <span className="file-size">{formatFileSize(fileObj.size)}</span>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeFile(fileObj.id)}
//                       className="remove-file-btn"
//                       title="Remove file"
//                     >
//                       <X className="remove-icon" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Model Selection */}
//         <div className="model-selection">
//           <h3>Select Models for Analysis:</h3>
//           <div className="models-grid">
//             {models.map(model => (
//               <label key={model.id} className="model-option">
//                 <input
//                   type="checkbox"
//                   checked={selectedModels.includes(model.id)}
//                   onChange={() => handleModelToggle(model.id)}
//                 />
//                 <div className="model-info">
//                   <span className="model-name">{model.name}</span>
//                   <span className="model-desc">{model.description}</span>
//                 </div>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div className="button-group">
//           <button type="submit" className="analyze-btn">
//             <Send className="btn-icon" />
//             Analyze Content
//           </button>
//           <button type="button" onClick={handleClear} className="clear-btn">
//             <Trash2 className="btn-icon" />
//             Clear All
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default NewsInput;

import React, { useState, useRef } from 'react';
import { Send, FileText, Trash2, Upload, Image, FileUp, X } from 'lucide-react';
import { analyzeNews } from '../../services/api';
import './NewsInput.css';

const ACCEPTED_FILE_TYPES = {
  images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
  documents: ['.pdf', '.doc', '.docx', '.txt'],
  videos: ['.mp4', '.avi', '.mov', '.wmv', '.flv']
};

const MODELS = [
  { id: 'twitter', name: 'Twitter Model', description: 'Trained on Twitter data' },
  { id: 'mediaeval', name: 'MediaEval Model', description: 'MediaEval benchmark dataset' },
  { id: 'socialcontext', name: 'Social Context Model', description: 'Social context analysis' }
];

const NewsInput = ({ onAnalysis, onLoading, onError, onReset }) => {
  // State management
  const [newsText, setNewsText] = useState('');
  const [selectedModels, setSelectedModels] = useState(MODELS.map(m => m.id));
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);

  // Drag & Drop handlers
  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelection(Array.from(e.dataTransfer.files));
  };

  // File input handler
  const handleFileInput = e => handleFileSelection(Array.from(e.target.files));

  // Validate and add selected files
  const handleFileSelection = files => {
    const allAccepted = [...ACCEPTED_FILE_TYPES.images, ...ACCEPTED_FILE_TYPES.documents, ...ACCEPTED_FILE_TYPES.videos];
    const validFiles = files.filter(file => allAccepted.includes('.' + file.name.split('.').pop().toLowerCase()));

    if (validFiles.length !== files.length) {
      onError('Some files were rejected. Allowed: Images, Documents, Videos.');
    }

    const newFiles = validFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // Remove file handler
  const removeFile = fileId => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter(f => f.id !== fileId);
    });
  };

  // Helper icons for files
  const getFileIcon = fileName => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return <Image className="file-icon" />;
    return <FileUp className="file-icon" />;
  };

  // Format file sizes nicely
  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault();

    if (!newsText.trim() && uploadedFiles.length === 0) {
      onError('Please enter text or upload files');
      return;
    }

    if (selectedModels.length === 0) {
      onError('Select at least one model');
      return;
    }

    onLoading(true);
    onError(null);

    try {
      const formData = new FormData();
      formData.append('text', newsText);
      formData.append('models', JSON.stringify(selectedModels));
      uploadedFiles.forEach(fileObj => formData.append('files', fileObj.file));

      const results = await analyzeNews(formData, selectedModels, true);
      onAnalysis(results);
    } catch (error) {
      onError(error.message || 'Analysis failed');
    } finally {
      onLoading(false);
    }
  };

  // Toggle model selection
  const handleModelToggle = modelId => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  // Clear all inputs
  const handleClear = () => {
    setNewsText('');
    uploadedFiles.forEach(fileObj => fileObj.preview && URL.revokeObjectURL(fileObj.preview));
    setUploadedFiles([]);
    onReset();
  };

  return (
    <div className="news-input">
      <header className="input-header">
        <FileText className="input-icon" />
        <h2>Multi-Modal Fake News Analysis</h2>
      </header>

      <form onSubmit={handleSubmit} className="input-form">
        {/* Text input */}
        <div className="textarea-container">
          <textarea
            value={newsText}
            onChange={e => setNewsText(e.target.value)}
            placeholder="Paste the news article or text you want to verify for authenticity..."
            className="news-textarea"
            rows={6}
          />
          <div className="char-count">{newsText.length} characters</div>
        </div>

        {/* File upload */}
        <div className="upload-section">
          <h3>Upload Files (Images, Documents, Videos)</h3>

          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="upload-icon" />
            <p>Drag & drop files here or click to browse</p>
            <p className="upload-hint">Supports: Images, PDFs, Documents, Videos</p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.doc,.docx,.txt,.mp4,.avi,.mov,.wmv,.flv"
              className="file-input-hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* Uploaded files preview */}
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              <h4>Uploaded Files ({uploadedFiles.length})</h4>
              <div className="files-grid">
                {uploadedFiles.map(fileObj => (
                  <div key={fileObj.id} className="file-item">
                    {fileObj.preview ? (
                      <img src={fileObj.preview} alt={fileObj.name} className="file-preview" />
                    ) : (
                      <div className="file-icon-container">{getFileIcon(fileObj.name)}</div>
                    )}
                    <div className="file-info">
                      <span className="file-name">{fileObj.name}</span>
                      <span className="file-size">{formatFileSize(fileObj.size)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(fileObj.id)}
                      className="remove-file-btn"
                      title="Remove file"
                    >
                      <X className="remove-icon" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Model selection */}
        <div className="model-selection">
          <h3>Select Models for Analysis:</h3>
          <div className="models-grid">
            {MODELS.map(model => (
              <label key={model.id} className="model-option">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model.id)}
                  onChange={() => handleModelToggle(model.id)}
                />
                <div className="model-info">
                  <span className="model-name">{model.name}</span>
                  <span className="model-desc">{model.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="analyze-btn">
            <Send className="btn-icon" />
            Analyze Content
          </button>
          <button type="button" onClick={handleClear} className="clear-btn">
            <Trash2 className="btn-icon" />
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsInput;
