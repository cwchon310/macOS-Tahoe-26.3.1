import React, { useState } from 'react';
import { History, Copy } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeOperator, setActiveOperator] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
      setActiveOperator(null);
    } else {
      setDisplay(prev => prev === '0' ? num : prev + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display);
    setActiveOperator(op);
    setShouldResetDisplay(true);
  };

  const calculate = () => {
    if (!activeOperator || !equation) return;
    try {
      // Safe calculation without eval
      const prev = parseFloat(equation);
      const current = parseFloat(display);
      let result = 0;
      switch (activeOperator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': result = prev / current; break;
      }
      
      const resultStr = String(result);
      setDisplay(resultStr);
      setHistory(prevHist => [`${equation} ${activeOperator} ${display} = ${resultStr}`, ...prevHist]);
      setEquation('');
      setActiveOperator(null);
      setShouldResetDisplay(true);
    } catch {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setActiveOperator(null);
    setShouldResetDisplay(false);
  };

  const toggleSign = () => {
    setDisplay(prev => String(parseFloat(prev) * -1));
  };

  const percentage = () => {
    setDisplay(prev => String(parseFloat(prev) / 100));
  };

  const copyToDisplay = (entry: string) => {
    const result = entry.split(' = ')[1];
    if (result) {
      setDisplay(result);
      setEquation('');
      setActiveOperator(null);
      setShouldResetDisplay(true);
    }
  };

  return (
    <div className="h-full bg-[#282828]/90 backdrop-blur-xl flex flex-col text-white select-none rounded-b-xl overflow-hidden pt-12 relative">
      <button 
        onClick={() => setShowHistory(!showHistory)}
        className="absolute top-14 right-4 text-white/50 hover:text-white transition-colors z-10"
      >
        <History size={18} />
      </button>

      {showHistory && (
        <div className="absolute top-12 bottom-0 right-0 w-64 bg-[#1e1e1e]/95 backdrop-blur-xl border-l border-white/10 p-0 text-xs text-white/70 z-20 shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
          <div className="p-3 border-b border-white/10 font-semibold text-white/50 uppercase tracking-wider flex justify-between items-center">
            <span>History</span>
            <button onClick={() => setHistory([])} className="hover:text-red-400 transition-colors">Clear</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-8 text-center text-white/30 italic">No history yet</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className={`group flex flex-col p-3 border-b border-white/5 hover:bg-white/10 transition-colors ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}>
                  <div className="text-right text-white/50 mb-1 font-mono">{h.split(' = ')[0]}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-white font-light">{h.split(' = ')[1]}</span>
                    <button 
                      onClick={() => copyToDisplay(h)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-500 rounded text-white transition-all transform hover:scale-110"
                      title="Copy result to display"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="h-28 flex flex-col justify-end items-end px-4 py-2 shrink-0">
        <div className="text-5xl font-light tracking-tight truncate w-full text-right">{display}</div>
      </div>
      
      <div className="flex-1 grid grid-cols-4 gap-[1px] bg-black/80 p-[1px]">
        <button onClick={clear} className="bg-[#505050] hover:bg-[#6e6e6e] active:bg-[#8e8e8e] text-white text-xl transition-colors font-medium">
          {display !== '0' ? 'C' : 'AC'}
        </button>
        <button onClick={toggleSign} className="bg-[#505050] hover:bg-[#6e6e6e] active:bg-[#8e8e8e] text-white text-xl transition-colors font-medium">+/-</button>
        <button onClick={percentage} className="bg-[#505050] hover:bg-[#6e6e6e] active:bg-[#8e8e8e] text-white text-xl transition-colors font-medium">%</button>
        <button 
          onClick={() => handleOperator('/')} 
          className={`text-3xl transition-colors font-medium ${activeOperator === '/' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb340] active:bg-[#e08909] text-white'}`}
        >÷</button>
        
        {[7, 8, 9].map(n => <button key={n} onClick={() => handleNumber(String(n))} className="bg-[#333333] hover:bg-[#737373] active:bg-[#a5a5a5] text-white text-2xl transition-colors">{n}</button>)}
        <button 
          onClick={() => handleOperator('*')} 
          className={`text-3xl transition-colors font-medium ${activeOperator === '*' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb340] active:bg-[#e08909] text-white'}`}
        >×</button>
        
        {[4, 5, 6].map(n => <button key={n} onClick={() => handleNumber(String(n))} className="bg-[#333333] hover:bg-[#737373] active:bg-[#a5a5a5] text-white text-2xl transition-colors">{n}</button>)}
        <button 
          onClick={() => handleOperator('-')} 
          className={`text-3xl transition-colors font-medium ${activeOperator === '-' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb340] active:bg-[#e08909] text-white'}`}
        >−</button>
        
        {[1, 2, 3].map(n => <button key={n} onClick={() => handleNumber(String(n))} className="bg-[#333333] hover:bg-[#737373] active:bg-[#a5a5a5] text-white text-2xl transition-colors">{n}</button>)}
        <button 
          onClick={() => handleOperator('+')} 
          className={`text-3xl transition-colors font-medium ${activeOperator === '+' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb340] active:bg-[#e08909] text-white'}`}
        >+</button>
        
        <button onClick={() => handleNumber('0')} className="col-span-2 bg-[#333333] hover:bg-[#737373] active:bg-[#a5a5a5] text-white text-2xl text-left pl-7 transition-colors rounded-bl-xl">0</button>
        <button onClick={() => handleNumber('.')} className="bg-[#333333] hover:bg-[#737373] active:bg-[#a5a5a5] text-white text-2xl transition-colors">.</button>
        <button onClick={calculate} className="bg-[#ff9f0a] hover:bg-[#ffb340] active:bg-[#e08909] text-white text-3xl transition-colors rounded-br-xl">=</button>
      </div>
    </div>
  );
};
