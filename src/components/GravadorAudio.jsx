import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

export default function GravadorAudio({ onTranscricao, onAudioBlob, corPrimaria = '#0f172a' }) {
  const [gravando, setGravando] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcricao, setTranscricao] = useState('');
  const [transcricaoTemporaria, setTranscricaoTemporaria] = useState('');
  const [erro, setErro] = useState('');
  const [tempo, setTempo] = useState(0);
  const [reproduzindo, setReproduzindo] = useState(false);
  const [suportado, setSuportado] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const TEMPO_MAXIMO = 120; // 2 minutos

  useEffect(() => {
    // Verificar suporte
    const temMediaRecorder = 'MediaRecorder' in window;
    const temSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (!temMediaRecorder) {
      setSuportado(false);
      setErro('Seu navegador não suporta gravação de áudio. Use Chrome, Edge ou Safari.');
      return;
    }

    // Configurar Speech Recognition
    if (temSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscricao(prev => (prev + finalTranscript).trim());
        }
        setTranscricaoTemporaria(interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.warn('Erro na transcrição:', event.error);
        if (event.error === 'not-allowed') {
          setErro('Permissão de microfone negada. Verifique as configurações do navegador.');
        }
      };
    }

    return () => {
      pararGravacao();
    };
  }, []);

  useEffect(() => {
    // Atualizar callback quando transcrição mudar
    if (onTranscricao && transcricao) {
      onTranscricao(transcricao);
    }
  }, [transcricao, onTranscricao]);

  useEffect(() => {
    // Atualizar callback quando áudio mudar
    if (onAudioBlob && audioBlob) {
      onAudioBlob(audioBlob);
    }
  }, [audioBlob, onAudioBlob]);

  const iniciarGravacao = async () => {
    try {
      setErro('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);
        
        // Parar todas as tracks do stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(1000);
      setGravando(true);
      setTempo(0);

      // Iniciar timer
      timerRef.current = setInterval(() => {
        setTempo(prev => {
          if (prev >= TEMPO_MAXIMO - 1) {
            pararGravacao();
            return TEMPO_MAXIMO;
          }
          return prev + 1;
        });
      }, 1000);

      // Iniciar transcrição
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Transcrição já iniciada ou não suportada');
        }
      }

    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
      if (err.name === 'NotAllowedError') {
        setErro('Permissão de microfone negada. Clique no ícone de cadeado na barra de endereço para permitir.');
      } else {
        setErro('Erro ao acessar microfone. Verifique se está conectado.');
      }
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignorar erro se já parou
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setGravando(false);
    setTranscricaoTemporaria('');
  };

  const removerAudio = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
    setTranscricao('');
    setTempo(0);
    setReproduzindo(false);
    
    if (onTranscricao) onTranscricao('');
    if (onAudioBlob) onAudioBlob(null);
  };

  const toggleReproduzir = () => {
    if (audioRef.current) {
      if (reproduzindo) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setReproduzindo(!reproduzindo);
    }
  };

  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  if (!suportado) {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>{erro || 'Gravação de áudio não suportada neste navegador.'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Controles de Gravação */}
      <div className="flex items-center gap-3">
        {!audioURL ? (
          <>
            <button
              type="button"
              onClick={gravando ? pararGravacao : iniciarGravacao}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                gravando 
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                  : 'text-white hover:opacity-90'
              }`}
              style={!gravando ? { backgroundColor: corPrimaria } : {}}
            >
              {gravando ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Parar</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Gravar Áudio</span>
                </>
              )}
            </button>
            
            {gravando && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-mono font-semibold text-gray-700">
                  {formatarTempo(tempo)} / {formatarTempo(TEMPO_MAXIMO)}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <audio 
              ref={audioRef} 
              src={audioURL} 
              onEnded={() => setReproduzindo(false)}
              className="hidden"
            />
            <button
              type="button"
              onClick={toggleReproduzir}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: corPrimaria }}
            >
              {reproduzindo ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Ouvir</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={removerAudio}
              className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold text-sm hover:bg-red-200 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remover</span>
            </button>

            <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">{formatarTempo(tempo)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Transcrição em Tempo Real */}
      {(gravando || transcricao) && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Transcrição {gravando && '(em tempo real)'}
            </span>
            {gravando && (
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {transcricao}
            {transcricaoTemporaria && (
              <span className="text-gray-400 italic"> {transcricaoTemporaria}</span>
            )}
            {!transcricao && !transcricaoTemporaria && gravando && (
              <span className="text-gray-400 italic">Aguardando fala...</span>
            )}
            {!transcricao && !gravando && (
              <span className="text-gray-400 italic">Transcrição não disponível. O áudio foi gravado normalmente.</span>
            )}
          </p>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{erro}</p>
            <p className="text-xs mt-1 text-red-600">Dica: Use o campo de texto abaixo para descrever a ocorrência.</p>
          </div>
        </div>
      )}

      {/* Dica */}
      {!gravando && !audioURL && !erro && (
        <p className="text-xs text-gray-500">
          💡 Grave um áudio descrevendo a ocorrência. A transcrição será feita automaticamente.
        </p>
      )}
    </div>
  );
}
