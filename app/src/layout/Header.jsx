import React, { useState, useRef } from 'react';
import { Navbar, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import Button from '../components/Button';
import './style.css';
import logo from '../assets/logo.png';

function Header() {
  const [query, setQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcriptionService, setTranscriptionService] = useState('deepgram'); // Default to Deepgram
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // API Base URL - can be configured via environment variables
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  
  // API Keys - Use environment variables for security
  const ASSEMBLYAI_API_KEY = process.env.REACT_APP_ASSEMBLYAI_API_KEY;
  const DEEPGRAM_API_KEY = process.env.REACT_APP_DEEPGRAM_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/product?style=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
      
      // Navigate to search results page
      navigate('/search-results', { state: { results: data, query } });
      
    } catch (error) {
      console.error("Search error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // AssemblyAI Transcription
  const transcribeWithAssemblyAI = async (audioBlob) => {
    try {
      if (!ASSEMBLYAI_API_KEY) {
        throw new Error('AssemblyAI API key is missing. Please check your environment variables.');
      }

      console.log('Uploading audio to AssemblyAI...');
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLYAI_API_KEY,
        },
        body: audioBlob
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      const audioUrl = uploadData.upload_url;

      console.log('Starting transcription...');
      const transcriptionResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLYAI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: audioUrl,
          language_detection: true
        })
      });

      if (!transcriptionResponse.ok) {
        const errorText = await transcriptionResponse.text();
        throw new Error(`Transcription request failed: ${transcriptionResponse.status} - ${errorText}`);
      }

      const transcriptionData = await transcriptionResponse.json();
      const transcriptId = transcriptionData.id;

      // Poll for transcription result
      let transcribedText = '';
      let attempts = 0;
      const maxAttempts = 30; // 30 second timeout

      console.log('Polling for transcription result...');
      while (attempts < maxAttempts) {
        const resultResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: {
            'Authorization': ASSEMBLYAI_API_KEY,
          }
        });

        if (!resultResponse.ok) {
          throw new Error(`Transcript fetch failed: ${resultResponse.status}`);
        }

        const resultData = await resultResponse.json();
        
        if (resultData.status === 'completed') {
          transcribedText = resultData.text;
          console.log('AssemblyAI transcription completed:', transcribedText);
          break;
        } else if (resultData.status === 'error') {
          throw new Error(`Transcription failed: ${resultData.error}`);
        }
        
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transcription timeout - took too long to process');
      }

      return transcribedText;

    } catch (error) {
      console.error('AssemblyAI transcription error:', error);
      throw error;
    }
  };

  // Deepgram Transcription with improved error handling
  const transcribeWithDeepgram = async (audioBlob) => {
    try {
      if (!DEEPGRAM_API_KEY) {
        throw new Error('Deepgram API key is missing. Please check your environment variables.');
      }

      // Convert to array buffer for better compatibility
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      console.log('Sending audio to Deepgram...');
      const response = await fetch('https://api.deepgram.com/v1/listen', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'audio/webm',
        },
        body: arrayBuffer
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Deepgram API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.channels && data.results.channels.length > 0) {
        const transcript = data.results.channels[0].alternatives[0].transcript;
        console.log('Deepgram transcription completed:', transcript);
        return transcript;
      } else {
        throw new Error('No transcription results from Deepgram');
      }
    } catch (error) {
      console.error('Deepgram transcription error:', error);
      throw error;
    }
  };

  const startVoiceRecording = async () => {
    // Check if API keys are available
    if (transcriptionService === 'assemblyai' && !ASSEMBLYAI_API_KEY) {
      setError('AssemblyAI API key is not configured. Please check your environment variables.');
      return;
    }
    
    if (transcriptionService === 'deepgram' && !DEEPGRAM_API_KEY) {
      setError('Deepgram API key is not configured. Please check your environment variables.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'audio/webm;codecs=opus' 
      });
      mediaRecorderRef.current = mediaRecorder;
      
      let audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processVoiceSearch(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setError(null);
      
      // Set up 10-second recording timer
      let timeLeft = 10;
      setRecordingTime(timeLeft);
      
      recordingIntervalRef.current = setInterval(() => {
        timeLeft -= 1;
        setRecordingTime(timeLeft);
        
        if (timeLeft <= 0) {
          stopVoiceRecording();
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      setRecordingTime(0);
    }
  };

  const processVoiceSearch = async (audioBlob) => {
    setLoading(true);
    setError(null);
    setTranscriptionResult(null);

    try {
      let transcribedText = '';
      const startTime = Date.now();
      
      if (transcriptionService === 'assemblyai') {
        transcribedText = await transcribeWithAssemblyAI(audioBlob);
      } else if (transcriptionService === 'deepgram') {
        transcribedText = await transcribeWithDeepgram(audioBlob);
      }
      
      const processingTime = Date.now() - startTime;
      
      setTranscriptionResult({
        text: transcribedText,
        service: transcriptionService,
        processingTime: processingTime
      });

      if (transcribedText) {
        setQuery(transcribedText);
        
        // Auto-submit the search if we have results
        if (transcribedText.trim().length > 0) {
          // Small delay to show transcription result before search
          setTimeout(() => {
            handleSubmit(new Event('submit'));
          }, 500);
        }
      } else {
        setError('No speech detected. Please try again.');
      }
      
    } catch (error) {
      console.error('Voice search error:', error);
      setError(`Voice transcription failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTranscriptionService = () => {
    const newService = transcriptionService === 'assemblyai' ? 'deepgram' : 'assemblyai';
    setTranscriptionService(newService);
    setError(null);
    setTranscriptionResult(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size must be less than 10MB.');
      return;
    }

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    processImageSearch(file);
  };

  const processImageSearch = async (imageFile) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('k', '8'); // Number of results

      const response = await fetch(`${API_BASE_URL}/filter-products`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image search failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setSearchResults(data);
        setQuery('Similar products');
        
        // Navigate to search results
        navigate('/search-results', { 
          state: { 
            results: data, 
            query: 'Similar products',
            searchType: 'image' 
          } 
        });
      } else {
        setError('No similar products found.');
      }
      
    } catch (error) {
      console.error('Image search error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerImageInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setQuery("");
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResults(null);
    setError(null);
    setTranscriptionResult(null);
    clearImage();
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+K or Cmd+K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
      
      // Escape to clear search
      if (e.key === 'Escape') {
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <header>
      <Navbar className="header" variant="dark" expand="lg">
        <div className="container d-flex justify-content-between align-items-center gap-5 w-100">
          <Navbar.Brand as={Link} to="/" className='brands gap-2 d-flex align-items-center'>
            <img src={logo} alt="logo" />
            <span className='fw-bold'>TRI-SHOP</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <div className="d-block d-lg-none w-100">
              <Menu color="white" />
            </div>

            <div className="d-flex align-items-center gap-3 w-100">
              {/* Search Form */}
              <form className="flex-grow-1 position-relative" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-white text-black pe-5"
                    placeholder="Search products by style or upload image..."
                    style={{ minWidth: '300px' }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                  />
                  
                  {/* Loading Indicator */}
                  {loading && (
                    <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                  
                  {/* Clear Button */}
                  {query && !loading && (
                    <button 
                      type="button" 
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3"
                      onClick={clearSearch}
                      style={{ zIndex: 5 }}
                    >
                      <i className="bi bi-x text-muted"></i>
                    </button>
                  )}
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="position-absolute start-0 top-50 translate-middle-y ms-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          objectFit: 'cover', 
                          borderRadius: '4px' 
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Transcription Result */}
                {transcriptionResult && (
                  <div className="position-absolute start-0 bottom-0 translate-middle-y mb-1 ms-2">
                    <Badge bg="success" className="small">
                      {transcriptionResult.service === 'deepgram' ? 'DG' : 'AAI'}: 
                      {transcriptionResult.processingTime}ms
                    </Badge>
                  </div>
                )}
                
                {/* Keyboard Shortcut Hint */}
                <small className="text-white-50 position-absolute start-0 bottom-0 translate-middle-y mb-1 ms-2">
                  Press Ctrl+K to focus
                </small>
              </form>

              {/* Search Actions */}
              <div className="d-flex align-items-center gap-2">
                {/* Service Toggle Button */}
                <button 
                  className={`btn ${transcriptionService === 'deepgram' ? 'btn-warning' : 'btn-info'} btn-sm`}
                  onClick={toggleTranscriptionService}
                  title={`Switch to ${transcriptionService === 'assemblyai' ? 'Deepgram' : 'AssemblyAI'}`}
                  disabled={loading || isRecording}
                >
                  <i className={`bi ${transcriptionService === 'assemblyai' ? 'bi-robot' : 'bi-magic'}`}></i>
                  <small className="ms-1">{transcriptionService === 'assemblyai' ? 'AAI' : 'DG'}</small>
                </button>

                {/* Voice Search Button */}
                <button 
                  className={`btn ${isRecording ? 'btn-danger' : 'btn-outline-light'} btn-sm`}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  title={isRecording ? 'Stop recording' : `Voice search with ${transcriptionService}`}
                  disabled={loading}
                >
                  <i className={`bi ${isRecording ? 'bi-stop-fill' : 'bi-mic-fill'}`}></i>
                  {isRecording && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {recordingTime}
                    </span>
                  )}
                </button>
                
                {/* Image Search Button */}
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={triggerImageInput}
                  title="Search by image"
                  disabled={loading}
                >
                  <i className="bi bi-camera-fill"></i>
                </button>
                
                {/* Search Button */}
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleSubmit}
                  disabled={loading || !query.trim()}
                  title="Search products"
                >
                  <i className="bi bi-search"></i>
                </button>
                
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              
              <Button buttonname="Login" />
            </div>
          </Navbar.Collapse>
        </div>
      </Navbar>
      
      <div className="d-none d-lg-block w-100">
        <Menu color="#00416A" />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="container mt-2">
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            <Alert.Heading>
              {transcriptionService === 'deepgram' ? 'Deepgram' : 'AssemblyAI'} Error
            </Alert.Heading>
            {error}
          </Alert>
        </div>
      )}

      {/* Recording Modal */}
      {isRecording && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Voice Search with {transcriptionService === 'deepgram' ? 'Deepgram' : 'AssemblyAI'}
                </h5>
                <button type="button" className="btn-close" onClick={stopVoiceRecording}></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <i className="bi bi-mic-fill text-danger fs-1"></i>
                </div>
                <h6>Listening...</h6>
                <p>Speak now. Recording will stop in {recordingTime} seconds</p>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated bg-danger" 
                    style={{ width: `${((10 - recordingTime) / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="alert alert-info small">
                  <i className="bi bi-info-circle"></i> Using {transcriptionService === 'deepgram' ? 
                  'Deepgram (Real-time)' : 'AssemblyAI (High accuracy)'}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={stopVoiceRecording}>
                  <i className="bi bi-stop-fill"></i> Stop Recording
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="bg-white rounded p-4 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">
              {transcriptionResult ? 'Searching products...' : `Processing with ${transcriptionService}...`}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;