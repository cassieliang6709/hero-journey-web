
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Users, Timer } from 'lucide-react';

const FocusTools: React.FC = () => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes
  const [pomodoroActive, setPomodoroActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          const newTime = prev + 1;
          
          if (breathingPhase === 'inhale' && newTime >= 4) {
            setBreathingPhase('hold');
            return 0;
          } else if (breathingPhase === 'hold' && newTime >= 4) {
            setBreathingPhase('exhale');
            return 0;
          } else if (breathingPhase === 'exhale' && newTime >= 6) {
            setBreathingPhase('inhale');
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [breathingActive, breathingPhase]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime]);

  const toggleBreathing = () => {
    setBreathingActive(!breathingActive);
    if (!breathingActive) {
      setBreathingPhase('inhale');
      setBreathingTimer(0);
    }
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase('inhale');
    setBreathingTimer(0);
  };

  const togglePomodoro = () => {
    setPomodoroActive(!pomodoroActive);
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroTime(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return `吸气 ${breathingTimer}/4`;
      case 'hold': return `屏住 ${breathingTimer}/4`;
      case 'exhale': return `呼气 ${breathingTimer}/6`;
    }
  };

  return (
    <div className="space-y-3">
      {/* 4-4-6 呼吸训练 */}
      <Card className="bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
            <h3 className="text-gray-900 font-medium">4-4-6 呼吸训练</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetBreathing}
            className="text-gray-600 hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center mb-4">
          <div className={`w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
            breathingActive 
              ? breathingPhase === 'inhale' 
                ? 'border-gray-900 bg-gray-100 scale-110' 
                : breathingPhase === 'hold'
                ? 'border-gray-600 bg-gray-50'
                : 'border-gray-400 bg-gray-50 scale-90'
              : 'border-gray-300 bg-gray-50'
          }`}>
            <span className="text-sm font-medium text-gray-700">
              {breathingActive ? breathingTimer : '●'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {breathingActive ? getBreathingInstruction() : '点击开始深呼吸'}
          </p>
        </div>
        
        <Button
          onClick={toggleBreathing}
          className={`w-full ${breathingActive ? 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          variant={breathingActive ? "outline" : "default"}
        >
          {breathingActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {breathingActive ? '暂停' : '开始呼吸'}
        </Button>
      </Card>

      {/* 番茄钟 */}
      <Card className="bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-gray-900" />
            <h3 className="text-gray-900 font-medium">专注番茄钟</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetPomodoro}
            className="text-gray-600 hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatTime(pomodoroTime)}
          </div>
          <p className="text-sm text-gray-600">
            {pomodoroActive ? '专注进行中...' : '准备开始专注'}
          </p>
        </div>
        
        <Button
          onClick={togglePomodoro}
          className={`w-full ${pomodoroActive ? 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          variant={pomodoroActive ? "outline" : "default"}
          disabled={pomodoroTime === 0}
        >
          {pomodoroActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {pomodoroActive ? '暂停' : '开始专注'}
        </Button>
      </Card>

      {/* 好友监督 */}
      <Card className="bg-white border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-4 h-4 text-gray-900" />
          <h3 className="text-gray-900 font-medium">好友监督</h3>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-gray-300 text-gray-600"
            disabled
          >
            邀请好友
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-gray-300 text-gray-600"
            disabled
          >
            打卡分享
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          功能开发中...
        </p>
      </Card>
    </div>
  );
};

export default FocusTools;
