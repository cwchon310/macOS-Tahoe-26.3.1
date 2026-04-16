import React, { useState, useRef, useEffect } from 'react';

interface FileSystemNode {
  type: 'file' | 'directory';
  name: string;
  children?: Record<string, FileSystemNode>;
  content?: string;
}

const INITIAL_FS: Record<string, FileSystemNode> = {
  'Users': {
    type: 'directory',
    name: 'Users',
    children: {
      'guest': {
        type: 'directory',
        name: 'guest',
        children: {
          'Desktop': { type: 'directory', name: 'Desktop', children: {} },
          'Documents': { type: 'directory', name: 'Documents', children: {} },
          'Downloads': { type: 'directory', name: 'Downloads', children: {} },
          'README.txt': { type: 'file', name: 'README.txt', content: 'Welcome to macOS Terminal Clone!\nThis is a high-fidelity simulation.' },
        }
      }
    }
  }
};

export const Terminal: React.FC = () => {
  const [fs, setFs] = useState<Record<string, FileSystemNode>>(INITIAL_FS);
  const [history, setHistory] = useState<string[]>([
    'Last login: Fri Mar 6 04:42:15 on ttys001',
    'Type "help" to see available commands.'
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState(['Users', 'guest']);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const getDir = (path: string[], currentFs: Record<string, FileSystemNode> = fs) => {
    let current: any = { children: currentFs };
    for (const part of path) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setHistory(prev => [...prev, `guest@macbook ${cwd[cwd.length - 1] || '/'} % `]);
      return;
    }

    const newHistory = [...history, `guest@macbook ${cwd[cwd.length - 1] || '/'} % ${trimmedInput}`];
    setCommandHistory(prev => [trimmedInput, ...prev]);
    setHistoryIndex(-1);

    const args = trimmedInput.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)?.map(arg => arg.replace(/^["']|["']$/g, '')) || [];
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'ls': {
        const dir = getDir(cwd);
        if (dir && dir.children) {
          const items = Object.keys(dir.children).join('  ');
          if (items) newHistory.push(items);
        }
        break;
      }
      case 'cd': {
        const target = args[1];
        if (!target || target === '~') {
          setCwd(['Users', 'guest']);
        } else if (target === '..') {
          if (cwd.length > 0) setCwd(cwd.slice(0, -1));
        } else if (target === '/') {
          setCwd([]);
        } else {
          const dir = getDir(cwd);
          if (dir && dir.children && dir.children[target] && dir.children[target].type === 'directory') {
            setCwd([...cwd, target]);
          } else {
            newHistory.push(`cd: no such file or directory: ${target}`);
          }
        }
        break;
      }
      case 'pwd':
        newHistory.push('/' + cwd.join('/'));
        break;
      case 'whoami':
        newHistory.push('guest');
        break;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'cat': {
        const target = args[1];
        if (!target) {
          newHistory.push('usage: cat [file]');
          break;
        }
        const dir = getDir(cwd);
        if (dir && dir.children && dir.children[target]) {
          if (dir.children[target].type === 'file') {
            newHistory.push(dir.children[target].content || '');
          } else {
            newHistory.push(`cat: ${target}: Is a directory`);
          }
        } else {
          newHistory.push(`cat: ${target}: No such file or directory`);
        }
        break;
      }
      case 'mkdir': {
        const target = args[1];
        if (!target) {
          newHistory.push('usage: mkdir [directory]');
          break;
        }
        const newFs = JSON.parse(JSON.stringify(fs));
        const dir = getDir(cwd, newFs);
        if (dir && dir.children) {
          if (dir.children[target]) {
            newHistory.push(`mkdir: ${target}: File exists`);
          } else {
            dir.children[target] = { type: 'directory', name: target, children: {} };
            setFs(newFs);
          }
        }
        break;
      }
      case 'touch': {
        const target = args[1];
        if (!target) {
          newHistory.push('usage: touch [file]');
          break;
        }
        const newFs = JSON.parse(JSON.stringify(fs));
        const dir = getDir(cwd, newFs);
        if (dir && dir.children) {
          if (!dir.children[target]) {
            dir.children[target] = { type: 'file', name: target, content: '' };
            setFs(newFs);
          }
        }
        break;
      }
      case 'rm': {
        const target = args[1];
        if (!target) {
          newHistory.push('usage: rm [file]');
          break;
        }
        const newFs = JSON.parse(JSON.stringify(fs));
        const dir = getDir(cwd, newFs);
        if (dir && dir.children) {
          if (dir.children[target]) {
            if (dir.children[target].type === 'directory' && args[1] !== '-r' && args[1] !== '-rf') {
              newHistory.push(`rm: ${target}: is a directory`);
            } else {
               delete dir.children[target];
               setFs(newFs);
            }
          } else {
            newHistory.push(`rm: ${target}: No such file or directory`);
          }
        }
        break;
      }
      case 'echo': {
        const content = args.slice(1).join(' ');
        const redirectIndex = args.indexOf('>');
        if (redirectIndex !== -1) {
           const text = args.slice(1, redirectIndex).join(' ');
           const target = args[redirectIndex + 1];
           if (target) {
             const newFs = JSON.parse(JSON.stringify(fs));
             const dir = getDir(cwd, newFs);
             if (dir && dir.children) {
                dir.children[target] = { type: 'file', name: target, content: text };
                setFs(newFs);
             }
           }
        } else {
           newHistory.push(content);
        }
        break;
      }
      case 'grep': {
        const pattern = args[1];
        const target = args[2];
        if (!pattern || !target) {
          newHistory.push('usage: grep [pattern] [file]');
          break;
        }
        const dir = getDir(cwd);
        if (dir && dir.children && dir.children[target] && dir.children[target].type === 'file') {
          const content = dir.children[target].content || '';
          const lines = content.split('\n');
          const matches = lines.filter(line => line.includes(pattern));
          if (matches.length > 0) {
            newHistory.push(matches.join('\n'));
          }
        } else {
          newHistory.push(`grep: ${target}: No such file or directory`);
        }
        break;
      }
      case 'history':
        newHistory.push(commandHistory.slice().reverse().map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n'));
        break;
      case 'man':
        newHistory.push(`No manual entry for ${args[1] || 'nothing'}`);
        break;
      case 'neofetch':
        newHistory.push(
          `                    'c.          guest@macbook\n` +
          `                 ,xNMM.          -------------\n` +
          `               .OMMMMo           OS: macOS Tahoe 26.3.1 (25D2128)\n` +
          `               OMMM0,            Host: MacBook Pro 16-inch (M5 Super Core)\n` +
          `     .;loddo:' loolloddol;.      Kernel: Darwin 26.3.1\n` +
          `   cKMMMMMMMMMMNWMMMMMMMMMM0,    Uptime: 2 hours, 45 mins\n` +
          ` .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Packages: 1582 (brew)\n` +
          ` XMMMMMMMMMMMMMMMMMMMMMMMX.      Shell: zsh 6.1 (arm64)\n` +
          `;MMMMMMMMMMMMMMMMMMMMMMMM:       Resolution: 3456x2234 (Liquid Retina XDR)\n` +
          `:MMMMMMMMMMMMMMMMMMMMMMMM:       DE: Aqua (Liquid Glass 2.0)\n` +
          `.MMMMMMMMMMMMMMMMMMMMMMMMX.      WM: Quartz Compositor\n` +
          ` kMMMMMMMMMMMMMMMMMMMMMMMMWd.    Terminal: iTerm3 (Tahoe Edition)\n` +
          ` .XMMMMMMMMMMMMMMMMMMMMMMMMMMk   CPU: Apple M5 Super Core (16-core)\n` +
          `  .XMMMMMMMMMMMMMMMMMMMMMMMMK.   GPU: Apple M5 Super Core (40-core)\n` +
          `    kMMMMMMMMMMMMMMMMMMMMMMd     Memory: 8192MiB / 131072MiB (128GB Unified)\n` +
          `     ;KMMMMMMMWXXWMMMMMMMk.\n` +
          `       .oKMMMMMMMMMMMMNo.\n` +
          `         .l0WMMMMWW0d.\n` +
          `            ..l0K0l..`
        );
        break;
      case 'help':
        newHistory.push('Available commands: ls, cd, pwd, cat, mkdir, rm, touch, echo, grep, history, man, clear, whoami, date, neofetch, help');
        break;
      case 'js': {
        const codeToEval = args.slice(1).join(' ');
        if (!codeToEval) {
          newHistory.push('Usage: js <javascript code>');
        } else {
          try {
            const result = eval(codeToEval);
            newHistory.push(String(result));
          } catch (err: any) {
            newHistory.push(`Error: ${err.message}`);
          }
        }
        break;
      }
      case 'sudo':
        newHistory.push('Password:');
        break;
      case 'open':
        newHistory.push('Opening apps from terminal is not yet supported in this version.');
        break;
      default:
        newHistory.push(`zsh: command not found: ${cmd}`);
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="h-full bg-[#1e1e1e]/95 text-white font-mono pt-12 p-4 overflow-auto text-[13px] leading-relaxed selection:bg-white/30 backdrop-blur-md rounded-b-xl"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="max-w-full">
        {history.map((line, i) => (
          <div key={i} className="mb-0.5 whitespace-pre-wrap break-all">
            {typeof line === 'string' && line.startsWith('guest@macbook') ? (
              <>
                <span className="text-[#50fa7b]">guest@macbook</span>
                <span className="text-white"> </span>
                <span className="text-[#8be9fd]">{line.split(' ')[1]}</span>
                <span className="text-white"> {line.split(' ').slice(2).join(' ')}</span>
              </>
            ) : line}
          </div>
        ))}
        <form onSubmit={handleCommand} className="flex items-center">
          <span className="text-[#50fa7b] shrink-0">guest@macbook</span>
          <span className="text-white mx-1 shrink-0">{cwd[cwd.length - 1] || '/'}</span>
          <span className="text-white mr-2 shrink-0">%</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-white caret-white"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};
