import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Trophy, Calendar, Check, Gift } from 'lucide-react';

interface Prize {
  name: string;
  points: number;
  coupon?: string;
  color: string;
}

export default function LuckyWheel() {
  const { 
    points, 
    addPoints, 
    luckySpinUsedToday, 
    useLuckySpin, 
    dailyRewardClaimed, 
    claimDailyReward 
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const [claimMessage, setClaimMessage] = useState('');
  const [dailyRewardSuccess, setDailyRewardSuccess] = useState(false);

  const prizes: Prize[] = [
    { name: "50 GLOW POINTS", points: 50, color: "#FF4FA3" },
    { name: "20% OFF (GLOW20)", points: 0, coupon: "GLOW20", color: "#6A5CFF" },
    { name: "10 GLOW POINTS", points: 10, color: "#00E5FF" },
    { name: "30% OFF (SAKURA30)", points: 0, coupon: "SAKURA30", color: "#FFD93D" },
    { name: "100 GLOW POINTS", points: 100, color: "#FF4FA3" },
    { name: "15% OFF (NEON15)", points: 0, coupon: "NEON15", color: "#6A5CFF" },
    { name: "JACKPOT 200 GP!", points: 200, color: "#00E5FF" },
    { name: "30 GLOW POINTS", points: 30, color: "#FFD93D" }
  ];

  const [currentAngle, setCurrentAngle] = useState(0);

  // Draw the initial wheel
  useEffect(() => {
    drawWheel(currentAngle);
  }, [currentAngle]);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const sliceAngle = (Math.PI * 2) / prizes.length;

    // Draw slices
    prizes.forEach((prize, idx) => {
      const startAngle = angle + idx * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      // Border lines
      ctx.strokeStyle = '#0A0715';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = prize.color === '#FFD93D' ? '#0A0715' : '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      
      // Shorten text if needed
      const prizeText = prize.name;
      ctx.fillText(prizeText, radius - 15, 3);
      ctx.restore();
    });

    // Draw center hub pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#0A0715';
    ctx.fill();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Small glowing center hub detail
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FF4FA3';
    ctx.fill();
  };

  const spin = () => {
    if (isSpinning || luckySpinUsedToday) return;

    setIsSpinning(true);
    setWinningPrize(null);
    setClaimMessage('');

    const startRotations = 5; // Minimum full rotations
    const randomExtraDegrees = Math.random() * 360;
    const totalRotation = startRotations * 360 + randomExtraDegrees;
    
    let currentRotation = 0;
    const duration = 4000; // 4 seconds spin
    const startTime = performance.now();

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutQuad or easeOutCubic)
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentDegrees = ease * totalRotation;
      const currentRad = (currentDegrees * Math.PI) / 180;

      setCurrentAngle(currentRad);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        // Calculate winning slice
        const finalAngleDegrees = (currentDegrees % 360);
        // The pointer is at the top (which is -90 degrees or 270 degrees in canvas math)
        // Adjust for canvas alignment
        const pointerAngleDegrees = 270;
        let winningIndex = Math.floor(
          ((pointerAngleDegrees - finalAngleDegrees + 360) % 360) / (360 / prizes.length)
        );
        
        // Safety bounds checking
        winningIndex = (winningIndex + prizes.length) % prizes.length;
        const prize = prizes[winningIndex];

        setWinningPrize(prize);
        setIsSpinning(false);

        // Record the spin with state store
        useLuckySpin(prize.name, prize.points);

        if (prize.points > 0) {
          setClaimMessage(`🦊 Hiku says: Incredible! You earned +${prize.points} GP to your balance!`);
        } else if (prize.coupon) {
          setClaimMessage(`🦊 Hiku says: Wow! You unlocked coupon '${prize.coupon}'! Copy it during checkout!`);
        }
      }
    };

    requestAnimationFrame(animateSpin);
  };

  const handleClaimDaily = () => {
    if (dailyRewardClaimed) return;
    const amt = claimDailyReward();
    setDailyRewardSuccess(true);
    setTimeout(() => setDailyRewardSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" id="lucky-rewards-section">
      
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 font-mono text-xs font-bold text-yellow-400 uppercase tracking-widest mb-3">
          <Gift className="h-3.5 w-3.5" />
          <span>Neo Tokyo Arcade Club</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
          Daily Perks & Lucky Spin
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Level up your loyalty stats! Claim your daily check-in points and spin the holographic wheel of destiny for sweet discounts and huge point bundles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Daily Check-In */}
        <div className="lg:col-span-5 border border-purple-500/20 rounded-3xl bg-slate-950/80 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <h3 className="text-lg font-extrabold text-slate-100 tracking-wide uppercase flex items-center gap-2 mb-4 font-sans">
            <Calendar className="h-5 w-5 text-pink-400" />
            <span>Daily Check-In</span>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Log in every day and receive a guaranteed <span className="text-pink-400 font-bold">+50 Glow Points</span>! Use these to climb the rankings to unlock custom store discounts and avatar titles.
          </p>

          {/* Daily card */}
          <div className="border border-purple-500/15 rounded-2xl bg-slate-900/40 p-4 text-center mb-6">
            <span className="text-[10px] font-mono text-cyan-400 block uppercase tracking-wider">Today's Alchemical Gift</span>
            <div className="text-2xl font-black text-yellow-400 font-mono mt-1">+50 GP</div>
            <span className="text-[9px] text-slate-500 block font-mono uppercase mt-0.5">Cooldown resets at Midnight UTC</span>
          </div>

          <button
            onClick={handleClaimDaily}
            disabled={dailyRewardClaimed}
            className={`w-full py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition duration-200 ${
              dailyRewardClaimed
                ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white shadow-lg shadow-pink-500/10'
            }`}
          >
            {dailyRewardClaimed ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check className="h-4 w-4" /> REWARD CLAIMED TODAY
              </span>
            ) : (
              'RECLAIM +50 GLOW POINTS'
            )}
          </button>

          {dailyRewardSuccess && (
            <div className="mt-3 text-center text-xs text-emerald-400 font-mono animate-pulse uppercase">
              ⭐ Success! +50 Glow Points credited to profile!
            </div>
          )}

          {/* Leaderboard stats summary */}
          <div className="border-t border-slate-900 mt-6 pt-6 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">Glow Rank Perks:</h4>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">1. Glow Cadet (0-200 GP)</span>
              <span className="text-slate-500 font-mono">Standard Club</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">2. Manga Spark (201-400 GP)</span>
              <span className="text-slate-500 font-mono">5% Off Custom Cap</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-pink-400">
              <span className="font-mono">3. Elite Otaku (401+ GP) ⭐</span>
              <span className="font-mono">Free Mystery Gacha Box</span>
            </div>
          </div>

        </div>

        {/* Right Side: Spin Wheel */}
        <div className="lg:col-span-7 border border-purple-500/20 rounded-3xl bg-slate-950/80 p-6 shadow-xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <h3 className="text-lg font-extrabold text-slate-100 tracking-wide uppercase flex items-center gap-2 mb-4 self-start font-sans">
            <Trophy className="h-5 w-5 text-cyan-400" />
            <span>Lucky Destiny Wheel</span>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed mb-6 self-start">
            Are you feeling lucky today, protagonist? Spin our holographic wheel once a day for a chance to instantly secure <span className="text-cyan-400 font-bold">200 GP</span> or 30% discount coupons!
          </p>

          {/* Spinning Wheel Area */}
          <div className="relative w-72 h-72 mb-6" id="lucky-spin-wheel-interactive">
            {/* The Pointer arrow at the top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-pink-500 z-10 animate-pulse drop-shadow-lg shadow-pink-500"></div>

            {/* Canvas Wheel */}
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="rounded-full shadow-2xl shadow-cyan-500/5 border-4 border-slate-900 bg-slate-950 block"
            />
          </div>

          {/* Action trigger button */}
          <button
            onClick={spin}
            disabled={isSpinning || luckySpinUsedToday}
            className={`w-full py-3.5 rounded-2xl text-sm font-black tracking-widest uppercase transition duration-200 ${
              luckySpinUsedToday
                ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 hover:scale-[1.02] text-slate-950 shadow-xl shadow-cyan-500/10'
            }`}
          >
            {isSpinning ? (
              <span className="flex items-center justify-center gap-1.5">
                <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                SPINNING WHEEL OF DESTINY...
              </span>
            ) : luckySpinUsedToday ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check className="h-4 w-4" /> SPIN COMPLETED TODAY
              </span>
            ) : (
              'SPIN THE WHEEL'
            )}
          </button>

          {/* Spin outcomes speech bubble */}
          {winningPrize && (
            <div className="mt-6 w-full p-4 rounded-2xl border-2 border-cyan-400/30 bg-slate-900/80 animate-scale-up text-center">
              <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase tracking-wider mb-1">CONGRATULATIONS!</span>
              <h4 className="text-lg font-black text-white uppercase tracking-wide">
                ⭐ {winningPrize.name} ⭐
              </h4>
              <p className="text-xs text-slate-300 mt-2 font-mono">
                {claimMessage}
              </p>
            </div>
          )}

          {luckySpinUsedToday && !winningPrize && (
            <div className="mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider text-center">
              Cooldowm active. Spin ready again in 14 hours!
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
