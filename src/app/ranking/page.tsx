'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaTrophy, FaCrown, FaMedal, FaStar, FaArrowLeft, FaFire } from 'react-icons/fa';
import Link from 'next/link';

interface Player {
  username: string;
  points: number;
  rank: number;
  avatar: string;
}

export default function Ranking() {
  const router = useRouter();
  const [user, setUser] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    const currentUser = JSON.parse(userData);

    // Generate mock players for ranking
    const mockPlayers: Player[] = [
      { username: 'FireMaster', points: 15420, rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FireMaster' },
      { username: 'SnipersElite', points: 14890, rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SnipersElite' },
      { username: 'ThunderBolt', points: 13650, rank: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThunderBolt' },
      { username: 'NightHawk', points: 12340, rank: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NightHawk' },
      { username: 'PhoenixRise', points: 11890, rank: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhoenixRise' },
      { username: 'ShadowBlade', points: 10560, rank: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowBlade' },
      { username: 'DragonFury', points: 9870, rank: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DragonFury' },
      { username: 'StormBreaker', points: 8950, rank: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StormBreaker' },
      { username: 'IceQueen', points: 8420, rank: 9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IceQueen' },
      { username: 'BlitzKing', points: 7890, rank: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BlitzKing' },
    ];

    // Add current user to ranking
    const userInRanking = mockPlayers.find(p => p.username === currentUser.username);
    if (!userInRanking) {
      currentUser.rank = Math.floor(Math.random() * 20) + 11;
      mockPlayers.push(currentUser);
      mockPlayers.sort((a, b) => b.points - a.points);
    } else {
      currentUser.rank = userInRanking.rank;
      currentUser.points = userInRanking.points;
    }

    setUser(currentUser);
    setPlayers(mockPlayers);
  }, [router]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <FaCrown className="text-yellow-400 text-2xl" />;
    if (rank === 2) return <FaMedal className="text-gray-300 text-2xl" />;
    if (rank === 3) return <FaMedal className="text-amber-600 text-2xl" />;
    if (rank <= 10) return <FaStar className="text-primary text-xl" />;
    return <span className="text-gray-500 text-lg">#{rank}</span>;
  };

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-primary/20 border-primary';
    if (rank === 1) return 'bg-yellow-400/10 border-yellow-400/30';
    if (rank === 2) return 'bg-gray-300/10 border-gray-300/30';
    if (rank === 3) return 'bg-amber-600/10 border-amber-600/30';
    if (rank <= 10) return 'bg-primary/10 border-primary/20';
    return 'bg-secondary-lighter border-secondary';
  };

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
              <FaFire className="text-4xl text-primary" />
              <h1 className="text-2xl font-bold gradient-text">Ranking Diário</h1>
            </div>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-fire rounded-2xl p-8 mb-8 text-center"
        >
          <FaTrophy className="text-6xl text-white mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-2">Top 10 Jogadores</h2>
          <p className="text-white/90 text-lg">Os 10 melhores de hoje ganham uma conta de Free Fire!</p>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {/* 2nd Place */}
          {players[1] && (
            <div className="pt-8">
              <div className="bg-secondary-lighter border-2 border-gray-300/30 rounded-xl p-4 text-center">
                <img src={players[1].avatar} alt={players[1].username} className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-gray-300" />
                <FaMedal className="text-3xl text-gray-300 mx-auto mb-2" />
                <p className="font-bold text-white mb-1">{players[1].username}</p>
                <p className="text-accent font-semibold">{players[1].points} pts</p>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {players[0] && (
            <div>
              <div className="bg-gradient-to-b from-yellow-400/20 to-secondary-lighter border-2 border-yellow-400/50 rounded-xl p-4 text-center fire-glow">
                <FaCrown className="text-4xl text-yellow-400 mx-auto mb-2" />
                <img src={players[0].avatar} alt={players[0].username} className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-yellow-400" />
                <p className="font-bold text-white text-lg mb-1">{players[0].username}</p>
                <p className="text-accent font-bold text-xl">{players[0].points} pts</p>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {players[2] && (
            <div className="pt-8">
              <div className="bg-secondary-lighter border-2 border-amber-600/30 rounded-xl p-4 text-center">
                <img src={players[2].avatar} alt={players[2].username} className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-amber-600" />
                <FaMedal className="text-3xl text-amber-600 mx-auto mb-2" />
                <p className="font-bold text-white mb-1">{players[2].username}</p>
                <p className="text-accent font-semibold">{players[2].points} pts</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Full Ranking List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {players.map((player, index) => {
            const isCurrentUser = player.username === user.username;
            return (
              <motion.div
                key={player.username}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`${getRankBg(player.rank, isCurrentUser)} border rounded-xl p-4 flex items-center gap-4 transition-all ${
                  isCurrentUser ? 'fire-glow scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(player.rank)}
                </div>

                <img
                  src={player.avatar}
                  alt={player.username}
                  className={`w-12 h-12 rounded-full ${
                    player.rank <= 10 ? 'border-2 border-primary' : 'border border-gray-600'
                  }`}
                />

                <div className="flex-1">
                  <p className={`font-bold ${isCurrentUser ? 'text-primary' : 'text-white'}`}>
                    {player.username}
                    {isCurrentUser && <span className="ml-2 text-xs text-primary">(Você)</span>}
                  </p>
                  <p className="text-sm text-gray-400">
                    {player.rank <= 10 ? '✅ Qualificado para ganhar' : 'Continue jogando para entrar no Top 10'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-accent">{player.points}</p>
                  <p className="text-xs text-gray-400">pontos</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-secondary-lighter/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 text-center"
        >
          <p className="text-gray-300">
            O ranking é resetado todos os dias à meia-noite. Continue jogando para garantir sua posição!
          </p>
        </motion.div>
      </main>
    </div>
  );
}
