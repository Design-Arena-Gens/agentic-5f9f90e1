'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaFire, FaStar, FaTrophy, FaGamepad } from 'react-icons/fa';
import Link from 'next/link';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function Game() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const targetIdRef = useRef(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setHighScore(parsedUser.points || 0);
  }, [router]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnTarget = () => {
      if (!gameAreaRef.current) return;

      const area = gameAreaRef.current.getBoundingClientRect();
      const size = Math.random() * 40 + 40; // 40-80px
      const speed = Math.random() * 2 + 1; // 1-3 seconds

      const newTarget: Target = {
        id: targetIdRef.current++,
        x: Math.random() * (area.width - size),
        y: Math.random() * (area.height - size),
        size,
        speed,
      };

      setTargets((prev) => [...prev, newTarget]);

      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
      }, speed * 1000);
    };

    const interval = setInterval(spawnTarget, 800);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setGameOver(false);
    targetIdRef.current = 0;
  };

  const hitTarget = (targetId: number, size: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
    // Smaller targets = more points
    const points = Math.round(100 - size);
    setScore((prev) => prev + points);
  };

  const saveScore = () => {
    if (user) {
      const newPoints = user.points + score;
      const updatedUser = { ...user, points: newPoints };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setHighScore(newPoints);
    }
  };

  useEffect(() => {
    if (gameOver && score > 0) {
      saveScore();
    }
  }, [gameOver]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary-light to-secondary">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-secondary-lighter/80 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <FaArrowLeft />
              Voltar
            </Link>
            <div className="flex items-center gap-3">
              <FaGamepad className="text-4xl text-primary" />
              <h1 className="text-2xl font-bold gradient-text">Minigame</h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-lighter border border-primary/20 rounded-xl p-4 text-center"
          >
            <FaStar className="text-2xl text-accent mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Pontuação</p>
            <p className="text-3xl font-bold text-accent">{score}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary-lighter border border-primary/20 rounded-xl p-4 text-center"
          >
            <FaFire className="text-2xl text-primary mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Tempo</p>
            <p className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-primary'}`}>
              {timeLeft}s
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary-lighter border border-accent/20 rounded-xl p-4 text-center"
          >
            <FaTrophy className="text-2xl text-accent mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Pontos Totais</p>
            <p className="text-2xl font-bold text-white">{highScore}</p>
          </motion.div>
        </div>

        {/* Game Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div
            ref={gameAreaRef}
            className="relative w-full h-[500px] bg-secondary-lighter border-2 border-primary/30 rounded-2xl overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,95,0,0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          >
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FaGamepad className="text-6xl text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">Click Shot!</h2>
                  <p className="text-gray-300 mb-6 max-w-md">
                    Clique nos alvos que aparecem na tela o mais rápido possível!
                    Alvos menores valem mais pontos. Você tem 30 segundos!
                  </p>
                  <button
                    onClick={startGame}
                    className="px-8 py-4 bg-gradient-fire text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-xl"
                  >
                    COMEÇAR JOGO
                  </button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary/90 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <FaTrophy className="text-6xl text-accent mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-white mb-4">Fim de Jogo!</h2>
                  <div className="bg-secondary-lighter rounded-xl p-6 mb-6">
                    <p className="text-gray-400 mb-2">Pontuação desta rodada</p>
                    <p className="text-5xl font-bold text-accent mb-4">{score}</p>
                    <p className="text-gray-300">+{score} pontos adicionados ao seu total!</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={startGame}
                      className="px-6 py-3 bg-gradient-fire text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      JOGAR NOVAMENTE
                    </button>
                    <Link href="/dashboard">
                      <button className="px-6 py-3 bg-secondary-lighter border border-primary/20 text-white font-bold rounded-xl hover:bg-secondary transition-colors">
                        VOLTAR AO DASHBOARD
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Targets */}
            <AnimatePresence>
              {targets.map((target) => (
                <motion.div
                  key={target.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: target.x,
                    top: target.y,
                    width: target.size,
                    height: target.size,
                  }}
                  onClick={() => hitTarget(target.id, target.size)}
                >
                  <div className="w-full h-full rounded-full bg-gradient-fire fire-glow flex items-center justify-center border-4 border-white shadow-xl">
                    <FaFire className="text-white" style={{ fontSize: target.size * 0.4 }} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-secondary-lighter/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <FaGamepad className="text-primary" />
            Como Jogar
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-300">
            <div>
              <p className="font-semibold text-white mb-1">🎯 Clique nos Alvos</p>
              <p className="text-sm">Alvos de fogo aparecem aleatoriamente. Clique neles antes que desapareçam!</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">⚡ Seja Rápido</p>
              <p className="text-sm">Alvos menores valem mais pontos mas são mais difíceis de acertar!</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">🏆 Ganhe Pontos</p>
              <p className="text-sm">Sua pontuação é adicionada ao seu total para o ranking diário!</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
