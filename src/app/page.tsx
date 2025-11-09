'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaGamepad, FaTrophy, FaFire } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Simular login
      localStorage.setItem('user', JSON.stringify({
        username: formData.username,
        points: 0,
        rank: 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
      }));
    } else {
      // Simular registro
      localStorage.setItem('user', JSON.stringify({
        username: formData.username,
        email: formData.email,
        points: 0,
        rank: 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
      }));
    }

    router.push('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary-light to-secondary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left space-y-6"
        >
          <div className="flex items-center justify-center md:justify-start gap-3">
            <FaFire className="text-6xl text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Free Fire
            </h1>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ganhe Contas Grátis!
          </h2>

          <p className="text-gray-300 text-lg">
            Jogue nosso minigame, acumule pontos e entre no ranking diário.
            Os 10 melhores jogadores ganham uma conta de Free Fire!
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-secondary-lighter rounded-lg p-4 border border-primary/20">
              <FaGamepad className="text-3xl text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-300">Jogue Minigames</p>
            </div>
            <div className="bg-secondary-lighter rounded-lg p-4 border border-accent/20">
              <FaTrophy className="text-3xl text-accent mx-auto mb-2" />
              <p className="text-sm text-gray-300">Ganhe Pontos</p>
            </div>
            <div className="bg-secondary-lighter rounded-lg p-4 border border-primary/20">
              <FaFire className="text-3xl text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-300">Ganhe Contas</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login/Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-secondary-lighter border border-primary/20 rounded-2xl p-8 fire-glow"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-secondary rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  isLogin
                    ? 'bg-gradient-fire text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  !isLogin
                    ? 'bg-gradient-fire text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Cadastro
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome de Usuário
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-secondary rounded-lg border border-primary/30 focus:border-primary focus:outline-none text-white transition-colors"
                placeholder="Digite seu nome de usuário"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-secondary rounded-lg border border-primary/30 focus:border-primary focus:outline-none text-white transition-colors"
                  placeholder="Digite seu e-mail"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-secondary rounded-lg border border-primary/30 focus:border-primary focus:outline-none text-white transition-colors"
                placeholder="Digite sua senha"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-fire text-white font-bold rounded-lg hover:opacity-90 transition-opacity mt-6"
            >
              {isLogin ? 'ENTRAR' : 'CRIAR CONTA'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary-light transition-colors"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
