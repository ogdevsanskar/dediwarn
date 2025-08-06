import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Zap, Globe, ArrowRight, Play } from 'lucide-react';

export const Hero: React.FC = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const stats = [
    { label: 'Warnings Issued', value: '1,247' },
    { label: 'Lives Protected', value: '50K+' },
    { label: 'Network Nodes', value: '2,500' },
    { label: 'Response Time', value: '<15s' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Floating elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up border border-primary border-opacity-20">
            <Zap className="h-4 w-4 animate-pulse" />
            <span>Powered by Blockchain Technology</span>
          </div>
          
          {/* Main heading with typewriter effect */}
          <h1 className="text-4xl md:text-7xl font-bold text-text mb-6 leading-tight animate-fade-in-up">
            Decentralized Digital
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Warning System
            </span>
          </h1>
          
          <p className="text-xl text-textSecondary mb-10 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Secure, transparent, and immutable warning distribution powered by smart contracts. 
            Protect communities with blockchain-verified alerts that can't be censored or manipulated.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button className="group bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-2xl flex items-center space-x-2">
              <span>Launch Dashboard</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border-2 border-border text-text px-8 py-4 rounded-xl font-semibold hover:border-primary hover:text-primary transition-all duration-200 flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Animated stats */}
          <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-surface bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 border border-border inline-block">
              <div className="text-3xl font-bold text-primary mb-2">
                {stats[currentStat].value}
              </div>
              <div className="text-textSecondary">
                {stats[currentStat].label}
              </div>
            </div>
          </div>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Shield,
                title: 'Immutable Records',
                description: 'All warnings are stored on blockchain ensuring permanent, tamper-proof records.',
                color: 'text-primary',
                delay: '0.8s'
              },
              {
                icon: AlertTriangle,
                title: 'Real-time Alerts',
                description: 'Instant warning distribution through smart contracts and decentralized networks.',
                color: 'text-warning',
                delay: '1s'
              },
              {
                icon: Globe,
                title: 'Global Network',
                description: 'Decentralized infrastructure ensures warnings reach everyone, everywhere.',
                color: 'text-success',
                delay: '1.2s'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-surface bg-opacity-60 backdrop-blur-sm p-8 rounded-2xl border border-border hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-4 animate-fade-in-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className="relative mb-6">
                  <feature.icon className={`h-12 w-12 ${feature.color} mx-auto group-hover:scale-110 transition-transform duration-300`} />
                  <div className={`absolute inset-0 ${feature.color.replace('text-', 'bg-')} opacity-20 rounded-full blur-xl group-hover:opacity-40 transition-opacity`} />
                </div>
                <h3 className="text-xl font-semibold text-text mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-textSecondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};