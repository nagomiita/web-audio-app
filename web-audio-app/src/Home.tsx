import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [playState, setPlayState] = useState<"stop" | "play">("stop");
  const [duration, setDuration] = useState(0);
  const [timePosition, setTimePosition] = useState(0);
  const [source, setSource] = useState<MediaElementAudioSourceNode | null>(
    null
  );
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const spectrumRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioRef.current && audioCtxRef.current) {
      const elementSource = audioCtxRef.current.createMediaElementSource(
        audioRef.current
      );
      const analyser = audioCtxRef.current.createAnalyser();
      elementSource.connect(analyser).connect(audioCtxRef.current.destination);
      setSource(elementSource);
      setAnalyserNode(analyser);
    }

    return () => {
      audioCtxRef.current?.close();
      setSource(null);
      setAnalyserNode(null);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (spectrumRef.current) {
        spectrumRef.current.width = window.innerWidth;
        spectrumRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // 初回設定

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (source && analyserNode && playState === "play" && spectrumRef.current) {
      const canvas = spectrumRef.current;
      const canvasCtx = canvas.getContext("2d");
      if (!canvasCtx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      analyserNode.fftSize = 16384;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const barWidth = 1;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      function renderFrame() {
        requestAnimationFrame(renderFrame);
        if (analyserNode) {
          analyserNode.getByteFrequencyData(dataArray);
        }

        if (canvasCtx) {
          canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
          let x = 0;
          for (let i = 0; i < 128; i++) {
            const barHeight = dataArray[i];
            canvasCtx.fillStyle = "rgba(255,255,255,0.8)";
            canvasCtx.fillRect(
              x,
              canvasHeight - barHeight,
              barWidth,
              barHeight
            );
            x += barWidth + canvasWidth / 128;
          }
        }
      }
      renderFrame();
    }
  }, [playState, analyserNode, source]);

  const handleTogglePlay = () => {
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (playState === "stop") {
      audioRef.current?.play();
      setPlayState("play");
    } else {
      audioRef.current?.pause();
      setPlayState("stop");
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setTimePosition(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setTimePosition(0);
    setPlayState("stop");
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleChangeTimePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
    const position = parseFloat(e.target.value);
    setTimePosition(position);
    if (audioRef.current) {
      audioRef.current.currentTime = position;
    }
  };

  return (
    <>
      <button type="button" onClick={handleTogglePlay}>
        {playState === "stop" ? "開始" : "停止"}
      </button>
      <input
        type="range"
        min={0}
        max={duration}
        value={timePosition}
        onChange={handleChangeTimePosition}
      />
      <audio
        src="/demo.mp3"
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <canvas className="spectrums" ref={spectrumRef} />
    </>
  );
}
