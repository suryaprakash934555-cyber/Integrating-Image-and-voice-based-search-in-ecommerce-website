import React, { useState, useRef } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
  const [transcriptionService, setTranscriptionService] = useState('assemblyai');
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  // API Keys
  const ASSEMBLYAI_API_KEY = process.env.REACT_APP_ASSEMBLYAI_API_KEY||'73b00662e49c4aa2bb270a3ec8705540';
  const DEEPGRAM_API_KEY = process.env.REACT_APP_DEEPGRAM_API_KEY||'3020147ef806846932ecf29b63e07c1671a144e6';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      console.log("Response from backend:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // AssemblyAI Transcription
  const transcribeWithAssemblyAI = async (audioBlob) => {
    try {
      if (!ASSEMBLYAI_API_KEY) {
        throw new Error('AssemblyAI API key is missing');
      }

      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLYAI_API_KEY,
        },
        body: audioBlob
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      const audioUrl = uploadData.upload_url;

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
        throw new Error(`Transcription request failed: ${transcriptionResponse.status}`);
      }

      const transcriptionData = await transcriptionResponse.json();
      const transcriptId = transcriptionData.id;

      // Poll for transcription result
      let transcribedText = '';
      let attempts = 0;
      const maxAttempts = 30; // 30 second timeout

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
          break;
        } else if (resultData.status === 'error') {
          throw new Error(`Transcription failed: ${resultData.error}`);
        }
        
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Transcription timeout');
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
        throw new Error('Deepgram API key is missing');
      }

      // Convert to array buffer for better compatibility
      const arrayBuffer = await audioBlob.arrayBuffer();
      
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
        return data.results.channels[0].alternatives[0].transcript;
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
      alert('AssemblyAI API key is not configured. Please check your environment variables.');
      return;
    }
    
    if (transcriptionService === 'deepgram' && !DEEPGRAM_API_KEY) {
      alert('Deepgram API key is not configured. Please check your environment variables.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        
        try {
          let transcribedText = '';
          
          if (transcriptionService === 'assemblyai') {
            transcribedText = await transcribeWithAssemblyAI(audioBlob);
          } else if (transcriptionService === 'deepgram') {
            transcribedText = await transcribeWithDeepgram(audioBlob);
          }
          
          setQuery(transcribedText);
        } catch (error) {
          console.error('Error processing audio:', error);
          alert(`Voice transcription failed: ${error.message}`);
        }
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set up 5-second recording timer
      let timeLeft = 5;
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
      alert('Microphone access denied. Please allow microphone permissions.');
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        
        const formData = new FormData();
        formData.append('image', file);
        
        fetch('http://localhost:5000/image-search', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          console.log('Image search results:', data);
          setQuery(data.tags?.join(' ') || "");
        })
        .catch(error => {
          console.error('Error processing image:', error);
        });
      };
      reader.readAsDataURL(file);
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
  };

  const toggleTranscriptionService = () => {
    setTranscriptionService(prev => prev === 'assemblyai' ? 'deepgram' : 'assemblyai');
  };

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
              {/* Input Field */}
              <form className="flex-grow-1 position-relative" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control bg-white text-black pe-5"
                  placeholder="Search..."
                  style={{ minWidth: '250px' }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                
                {imagePreview && (
                  <div className="position-absolute top-0 end-0 mt-1 me-1">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <button 
                      type="button" 
                      className="btn-close btn-close-white"
                      style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '10px' }}
                      onClick={clearImage}
                    ></button>
                  </div>
                )}
              </form>

              {/* Icons */}
              <div className="d-flex align-items-center gap-3">
                {/* Service Toggle Button */}
                <button 
                  className="btn p-0"
                  onClick={toggleTranscriptionService}
                  title={`Switch to ${transcriptionService === 'assemblyai' ? 'Deepgram' : 'AssemblyAI'}`}
                >
                  <i className={`bi ${transcriptionService === 'assemblyai' ? 'bi-robot' : 'bi-magic'} text-white fs-5`}></i>
                </button>

                {/* Voice Recording Button */}
                <button 
                  className={`btn p-0 ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  title={isRecording ? 'Stop recording' : 'Voice search'}
                >
                  <i className={`bi ${isRecording ? 'bi-stop-circle-fill text-danger' : 'bi-mic-fill'} text-white fs-4`}></i>
                  {isRecording && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {recordingTime}
                    </span>
                  )}
                </button>
                
                {/* Image Upload Button */}
                <button 
                  className="btn p-0"
                  onClick={triggerImageInput}
                  title="Image search"
                >
                  <i className="bi bi-camera-fill text-white fs-4"></i>
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

      {/* Recording Indicator */}
      {isRecording && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="bg-white rounded p-4 text-center">
            <div className="mb-3">
              <i className="bi bi-mic-fill text-danger fs-1"></i>
            </div>
            <h5>Recording with {transcriptionService === 'assemblyai' ? 'AssemblyAI' : 'Deepgram'}</h5>
            <p>Speak now. Recording will stop in {recordingTime} seconds</p>
            <button className="btn btn-danger" onClick={stopVoiceRecording}>
              Stop Recording
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;