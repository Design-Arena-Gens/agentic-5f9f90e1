'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaTrophy, FaGamepad, FaCrown, FaFire, FaSignOutAlt, FaMedal, FaStar } from 'react-icons/fa';
import Link from 'next/link';

interface User {
  username: string;
  points: number;
  rank: number;
  avatar: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));

    // Countdown to end of day
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  const getRankBadge = () => {
    if (user.rank === 1) return { icon: FaCrown, color: 'text-yellow-400', label: '1º Lugar' };
    if (user.rank === 2) return { icon: FaMedal, color: 'text-gray-300', label: '2º Lugar' };
    if (user.rank === 3) return { icon: FaMedal, color: 'text-amber-600', label: '3º Lugar' };
    if (user.rank <= 10) return { icon: FaStar, color: 'text-primary', label: `${user.rank}º Lugar` };
    return { icon: FaTrophy, color: 'text-gray-500', label: `${user.rank}º Lugar` };
  };

  const rankInfo = getRankBadge();

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
            <div className="flex items-center gap-3">
              <FaFire className="text-4xl text-primary" />
              <h1 className="text-2xl font-bold gradient-text">Free Fire Ranking</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary-lighter border border-primary/20 rounded-2xl p-8 mb-8 fire-glow"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-primary fire-glow"
              />
              <div className={`absolute -bottom-2 -right-2 bg-secondary-lighter rounded-full p-2 border-2 border-primary`}>
                <rankInfo.icon className={`text-2xl ${rankInfo.color}`} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{user.username}</h2>
              <p className={`text-lg font-semibold ${rankInfo.color} mb-4`}>
                {rankInfo.label}
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-secondary rounded-lg px-6 py-3 border border-accent/30">
                  <p className="text-gray-400 text-sm">Pontos Totais</p>
                  <p className="text-2xl font-bold text-accent">{user.points}</p>
                </div>
                <div className="bg-secondary rounded-lg px-6 py-3 border border-primary/30">
                  <p className="text-gray-400 text-sm">Tempo Restante</p>
                  <p className="text-xl font-bold text-primary">{timeRemaining}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-6 p-4 bg-secondary rounded-lg border-l-4 border-primary">
            {user.rank <= 10 ? (
              <div className="flex items-center gap-3">
                <FaTrophy className="text-2xl text-accent" />
                <div>
                  <p className="text-green-400 font-semibold">Você está qualificado!</p>
                  <p className="text-gray-400 text-sm">Mantenha sua posição no Top 10 para ganhar uma conta de Free Fire!</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <FaGamepad className="text-2xl text-primary" />
                <div>
                  <p className="text-yellow-400 font-semibold">Continue jogando!</p>
                  <p className="text-gray-400 text-sm">Você precisa estar no Top 10 para ganhar. Jogue o minigame para aumentar seus pontos!</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Play Minigame Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/game">
              <div className="bg-gradient-fire rounded-2xl p-8 card-hover cursor-pointer h-full">
                <FaGamepad className="text-6xl text-white mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">Jogar Minigame</h3>
                <p className="text-white/90 mb-4">
                  Jogue nosso minigame exclusivo e ganhe pontos para subir no ranking!
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">Clique para jogar</span>
                  <span className="text-3xl">🎮</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Ranking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/ranking">
              <div className="bg-secondary-lighter border border-accent/20 rounded-2xl p-8 card-hover cursor-pointer h-full">
                <FaTrophy className="text-6xl text-accent mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">Ver Ranking</h3>
                <p className="text-gray-300 mb-4">
                  Veja sua posição e confira quem está no Top 10 do ranking diário!
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-accent font-semibold">Ver classificação</span>
                  <span className="text-3xl">🏆</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-secondary-lighter/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaFire className="text-primary" />
            Como Funciona
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-300">
            <div>
              <p className="font-semibold text-white mb-2">1. Jogue o Minigame</p>
              <p className="text-sm">Acumule pontos jogando nosso minigame divertido e viciante.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">2. Suba no Ranking</p>
              <p className="text-sm">Quanto mais pontos você fizer, melhor será sua posição no ranking diário.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">3. Ganhe a Conta</p>
              <p className="text-sm">Os 10 melhores jogadores do dia ganham uma conta de Free Fire grátis!</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
