'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare, ArrowLeft, Radio, Copy, Check, Info } from 'lucide-react';
import { TTSManager } from '@/utils/tts';
import DetectorEngine from '@/components/DetectorEngine';
import NavigationFooter from '@/components/NavigationFooter';

export default function CallPage() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [peerStatus, setPeerStatus] = useState('Connecting to signalling relay...');
  const [copiedId, setCopiedId] = useState(false);
  const [callError, setCallError] = useState('');
  const [mediaReady, setMediaReady] = useState(false);
  const [remoteStreamReady, setRemoteStreamReady] = useState(false);
  
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const peerRef = useRef<any>(null);
  const callRef = useRef<any>(null);
  const connRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const ttsRef = useRef<TTSManager | null>(null);

  // Load PeerJS and Initialize
  useEffect(() => {
    ttsRef.current = new TTSManager();

    import('peerjs').then(({ default: Peer }) => {
      const peer = new Peer();
      peerRef.current = peer;

      peer.on('open', (id) => {
        setPeerId(id);
        setPeerStatus('Ready for calls');
      });

      peer.on('error', (err: any) => {
        console.warn('[WebRTC Peer Error]', err);
        setCallError(`Connection problem: ${err.type || 'disconnected'}. Check the peer ID and try again.`);
        setPeerStatus('Connection unavailable');
        setIsCalling(false);
      });

      // Incoming Call
      peer.on('call', (call) => {
        setIncomingCall(call);
        setPeerStatus('Incoming call received');
      });

      // Incoming Data Connection
      peer.on('connection', (conn) => {
        setupDataConnection(conn);
      });
    }).catch(err => {
      console.error('[WebRTC] Failed to load PeerJS library:', err);
      setCallError('The calling service could not be loaded. Refresh the page and try again.');
      setPeerStatus('Calling service unavailable');
    });

    return () => {
      peerRef.current?.destroy();
      streamRef.current?.getTracks().forEach(track => track.stop());
      audioStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleStreamReady = async (videoStream: MediaStream) => {
    try {
      if (!audioStreamRef.current && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = audioStream;
        const audioTrack = audioStream.getAudioTracks()[0];
        if (audioTrack) {
          videoStream.addTrack(audioTrack);
        }
      }
    } catch (e) {
      console.warn('[Call] Microphone access not granted; video-only call active:', e);
    }
    streamRef.current = videoStream;
    setMediaReady(true);
  };

  const copyMyId = () => {
    if (!peerId) return;
    navigator.clipboard.writeText(peerId).then(() => {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }).catch(() => setCallError('Copy was blocked. Select and copy your ID manually.'));
  };

  const setupDataConnection = (conn: any) => {
    connRef.current = conn;
    conn.on('data', (data: any) => {
      setMessages(prev => [...prev, { sender: 'Remote', text: String(data) }]);
      ttsRef.current?.speak(String(data), 'female');
    });
    conn.on('open', () => {
      setIsConnected(true);
      setPeerStatus('Call connected (Voice & Video active)');
    });
    conn.on('close', () => {
      setIsConnected(false);
      setPeerStatus('Call ended');
    });
    conn.on('error', () => {
      setIsConnected(false);
    });
  };

  const handleCall = async () => {
    if (!remotePeerId.trim() || !peerRef.current) return;
    
    setCallError('');
    setIsCalling(true);
    setPeerStatus('Calling remote peer...');
    if (!streamRef.current) {
      setCallError('Camera and microphone are not ready yet. Allow access, then try again.');
      setIsCalling(false);
      return;
    }

    try {
      const call = peerRef.current.call(remotePeerId.trim(), streamRef.current);
      const conn = peerRef.current.connect(remotePeerId.trim());
      
      setupDataConnection(conn);
      
      call.on('stream', (remoteStream: MediaStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch(e => console.warn('Autoplay prevented:', e));
        }
           setRemoteStreamReady(true);
           setIsConnected(true);
        setIsCalling(false);
        setPeerStatus('Connected');
      });

      call.on('close', () => endCall());
      call.on('error', (err: any) => {
        console.warn('Call error:', err);
        setIsCalling(false);
        setPeerStatus(`Call failed: ${err.type || 'error'}`);
      });

      callRef.current = call;
    } catch (err: any) {
      console.error('Call initialization failed:', err);
      setIsCalling(false);
      setPeerStatus('Call initialization failed');
    }
  };

  const answerCall = async () => {
    if (!incomingCall) return;
    
    if (streamRef.current) {
      incomingCall.answer(streamRef.current);
      incomingCall.on('stream', (remoteStream: MediaStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch(e => console.warn('Autoplay prevented:', e));
        }
        setIsConnected(true);
        setPeerStatus('Call answered');
      });
      incomingCall.on('close', () => endCall());
      incomingCall.on('error', () => endCall());
      callRef.current = incomingCall;
      setIncomingCall(null);
    } else {
      setCallError('Camera and microphone are not ready yet. Allow access, then try again.');
    }
  };

  const endCall = () => {
    try { callRef.current?.close(); } catch {}
    try { connRef.current?.close(); } catch {}
    
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    streamRef.current?.getTracks().forEach(track => track.stop());
    callRef.current = null;
    connRef.current = null;
    
    setIsConnected(false);
    setIsCalling(false);
    setIncomingCall(null);
    setRemoteStreamReady(false);
    setMediaReady(false);
    setPeerStatus('Call disconnected');
  };

  const sendMessage = (text: string = chatInput) => {
    if (!text.trim() || !connRef.current) return;
    
    connRef.current.send(text);
    setMessages(prev => [...prev, { sender: 'You', text: text }]);
    setChatInput('');
  };

  // Web Speech API Voice-to-Text
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && isConnected && micEnabled) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (connRef.current) {
          connRef.current.send(`(Voice) ${transcript}`);
          setMessages(prev => [...prev, { sender: 'You', text: `(Voice) ${transcript}` }]);
        }
      };

      try {
        recognition.start();
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
      return () => {
        try { recognition.stop(); } catch {}
      };
    }
  }, [isConnected, micEnabled]);

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach(t => { t.enabled = !t.enabled; });
        setMicEnabled(audioTracks[0].enabled);
      } else {
        setMicEnabled(prev => !prev);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach(t => { t.enabled = !t.enabled; });
        setVideoEnabled(videoTracks[0].enabled);
      }
    }
  };

  // Gesture Engine Callbacks
  const handleSentenceDetected = (phrase: string) => {
    if (isConnected) {
      sendMessage(`(Gesture) ${phrase}`);
    }
  };

  return (
    <div className="call-container" style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="app-nav call-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" className="icon-btn" aria-label="Back to home"><ArrowLeft size={16} /></Link>
          <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Sanketika <span style={{ fontSize: '0.82em', opacity: 0.9 }}>(संकेतिका)</span></span>
            <span style={{ fontSize: '0.65rem', background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              Video Call
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/live" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
            <Radio size={14} color="var(--emerald)" /> Live Engine
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status:</span>
            <span style={{ fontSize: '0.8rem', color: isConnected ? 'var(--emerald)' : 'var(--accent)', fontWeight: 600 }}>{peerStatus}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>My ID:</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', userSelect: 'all', fontFamily: 'monospace' }}>
              {peerId || 'Loading...'}
            </strong>
            {peerId && (
              <button
                type="button"
                onClick={copyMyId}
               aria-label="Copy my peer ID"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId ? 'var(--emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
              >
                {copiedId ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
       </header>
       {callError && <div role="alert" className="inline-error">{callError}</div>}

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', gap: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', flexWrap: 'wrap' }}>
        
        {/* Videos Area */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', minHeight: '380px' }}>
            
            {/* Remote Video */}
            <div style={{ flex: 2, background: '#0a0a12', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              {!isConnected && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                  <Radio size={28} style={{ opacity: 0.4 }} />
                   <span>{remoteStreamReady ? 'Remote video is unavailable' : 'Waiting for peer connection...'}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Share your ID with another device or enter their ID in the sidebar to call.</span>
                </div>
              )}
            </div>
            
            {/* Local Video with Gesture Detector */}
            <div style={{ flex: 1, background: '#0a0a12', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
              <div style={{ position: 'absolute', inset: 0, transform: 'scaleX(-1)' }}>
                <DetectorEngine 
                  mode="asl"
                  outputMode="sentence"
                  voicePref="female"
                  isPaused={false}
                  onWordDetected={() => {}}
                  onSentenceDetected={handleSentenceDetected}
                  onSignUpdate={() => {}}
                  onGestureUpdate={() => {}}
                  onModeSwitch={() => {}}
                  onUniversalAction={() => {}}
                  onStreamReady={handleStreamReady}
                  hideUI={true}
                />
              </div>
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px' }}>
                You (AI Tracking)
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <button
              className="icon-btn"
              onClick={toggleMic}
               aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
               aria-pressed={!micEnabled}
              style={{ background: micEnabled ? 'var(--bg-base)' : 'var(--danger-soft)', color: micEnabled ? 'var(--text-primary)' : 'var(--danger)' }}
            >
              {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button
              className="icon-btn"
              onClick={toggleVideo}
               aria-label={videoEnabled ? 'Turn off video' : 'Turn on video'}
               aria-pressed={!videoEnabled}
              style={{ background: videoEnabled ? 'var(--bg-base)' : 'var(--danger-soft)', color: videoEnabled ? 'var(--text-primary)' : 'var(--danger)' }}
            >
              {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            
            {isConnected ? (
              <button
                className="icon-btn danger"
                onClick={endCall}
                 aria-label="End call"
                style={{ background: 'var(--danger)', color: 'white' }}
              >
                <PhoneOff size={20} />
              </button>
            ) : (
              <button
                className="icon-btn success"
                onClick={handleCall}
                disabled={!remotePeerId.trim() || isCalling}
                 aria-label="Start video call"
                style={{ background: 'var(--emerald)', color: 'white', opacity: (!remotePeerId.trim() || isCalling) ? 0.5 : 1 }}
              >
                <Phone size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Dialer */}
          {!isConnected && (
            <div className="card">
              <div className="card-header"><span className="card-title">Connect With Peer</span></div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Enter the remote peer ID below to initiate an accessible video call with gesture captions and voice synthesis.
              </p>
              <input 
                type="text" 
                placeholder="Paste remote peer ID..." 
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)', marginBottom: '1rem' }}
              />
              <button
                type="button"
                onClick={handleCall}
                disabled={!remotePeerId.trim() || isCalling || !mediaReady}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: (!remotePeerId.trim() || isCalling) ? 'not-allowed' : 'pointer',
                   opacity: (!remotePeerId.trim() || isCalling || !mediaReady) ? 0.6 : 1
                }}
              >
                {isCalling ? 'Connecting...' : mediaReady ? 'Call peer' : 'Preparing camera...'}
              </button>

              {incomingCall && (
                <div style={{ marginTop: '1rem', background: 'var(--accent-soft)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-bright)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Incoming call from peer!</span>
                   <button onClick={answerCall} style={{ background: 'var(--emerald)', color: 'white', border: 'none', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                     Answer Call
                   </button>
                   <button onClick={() => { try { incomingCall.close(); } catch {} setIncomingCall(null); setPeerStatus('Incoming call declined'); }} className="text-button">Decline</button>
                </div>
              )}
            </div>
          )}

          {/* Chat / Transcript */}
          <div className="card" style={{ flex: 1, minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header"><span className="card-title"><MessageSquare size={14} className="card-icon" /> Live Captions & Chat</span></div>
             <div role="log" aria-live="polite" aria-relevant="additions" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', maxHeight: '350px' }}>
              {messages.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
                   {isConnected ? 'No captions yet. Gestures and spoken words will appear here.' : 'Connect to start captions and chat.'}
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start', background: m.sender === 'You' ? 'var(--accent-soft)' : 'var(--bg-base)', color: m.sender === 'You' ? 'var(--accent)' : 'var(--text-primary)', padding: '0.5rem 0.85rem', borderRadius: '12px', maxWidth: '85%', fontSize: '0.85rem', border: '1px solid', borderColor: m.sender === 'You' ? 'var(--border-bright)' : 'var(--border)' }}>
                    {m.text}
                  </div>
                ))
              )}
            </div>
            {isConnected && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <label className="sr-only" htmlFor="chat-message">Message</label><input id="chat-message"
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(chatInput)}
                  placeholder="Type message..."
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                />
                <button onClick={() => sendMessage(chatInput)} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0 0.85rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Send</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <NavigationFooter />
    </div>
  );
}
