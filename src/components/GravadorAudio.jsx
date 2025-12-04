import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

export default function GravadorAudio({ onTranscricao, corPrimaria = '#0f172a' }) {
  const [gravando, setGravando] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcricao, setTranscricao] = useState('');
  const [transcricaoTemp, setTranscricaoTemp] = useState('');
  const [erro, setErro] = useState('');
  const [tempo, setTempo] = useState(0);
  const [reproduzindo, setReproduzindo] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const TEMPO_MAX = 120;

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR';
      recognitionRef.current.onresult = (e) => {
        let interim = '', final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
          else interim += e.results[i][0].transcript;
        }
        if (final) setTranscricao(p => (p + final).trim());
        setTranscricaoTemp(interim);
      };
    }
    return () => pararGravacao();
  }, []);

  useEffect(() => {
    if (onTranscricao) onTranscricao(transcricao);
  }, [transcricao]);

  const iniciarGravacao = async () => {
    try {
      setErro('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current.start(1000);
      setGravando(true);
      setTempo(0);
      timerRef.current = setInterval(() => {
        setTempo(p => { if (p >= TEMPO_MAX - 1) { pararGravacao(); return TEMPO_MAX; } return p + 1; });
      }, 1000);
      if (recognitionRef.current) try { recognitionRef.current.start(); } catch(e) {}
    } catch (err) { setErro('Erro ao acessar microfone.'); }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e) {}
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setGravando(false);
    setTranscricaoTemp('');
  };

  const removerAudio = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setTranscricao('');
    setTempo(0);
    setReproduzindo(false);
    if (onTranscricao) onTranscricao('');
  };

  const togglePlay = () => {
    if (audioRef.current) {
      reproduzindo ? audioRef.current.pause() : audioRef.current.play();
      setReproduzindo(!reproduzindo);
    }
  };

  const fmt = (s) => String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        {!audioURL ? (
          <>
            <button type="button" onClick={gravando ? pararGravacao : iniciarGravacao}
              className={'flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ' + (gravando ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'text-white')}
              style={!gravando ? { backgroundColor: corPrimaria } : {}}>
              {gravando ? <><Square className="w-4 h-4" /><span>Parar</span></> : <><Mic className="w-4 h-4" /><span>Gravar Áudio</span></>}
            </button>
            {gravando && <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div><span className="font-mono font-semibold text-gray-700">{fmt(tempo)} / {fmt(TEMPO_MAX)}</span></div>}
          </>
        ) : (
          <>
            <audio ref={audioRef} src={audioURL} onEnded={() => setReproduzindo(false)} className="hidden" />
            <button type="button" onClick={togglePlay} className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white" style={{ backgroundColor: corPrimaria }}>
              {reproduzindo ? <><Pause className="w-4 h-4" /><span>Pausar</span></> : <><Play className="w-4 h-4" /><span>Ouvir</span></>}
            </button>
            <button type="button" onClick={removerAudio} className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold text-sm hover:bg-red-200">
              <Trash2 className="w-4 h-4" /><span>Remover</span>
            </button>
            <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" /><span className="font-medium">{fmt(tempo)}</span>
            </div>
          </>
        )}
      </div>
      {(gravando || transcricao) && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <span className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Transcrição {gravando && '(tempo real)'}</span>
          <p className="text-sm text-gray-700">{transcricao}{transcricaoTemp && <span className="text-gray-400 italic"> {transcricaoTemp}</span>}{!transcricao && !transcricaoTemp && gravando && <span className="text-gray-400 italic">Aguardando fala...</span>}</p>
        </div>
      )}
      {erro && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"><AlertCircle className="w-5 h-5" /><span>{erro}</span></div>}
      {!gravando && !audioURL && !erro && <p className="text-xs text-gray-500">Grave um audio descrevendo a ocorrencia.</p>}
    </div>
  );
}
