'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  FileCode,
  Sliders,
  Check,
  X,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Folder,
  FileText,
  Clock,
  Send,
  Zap,
} from 'lucide-react';

interface ScriptFile {
  name: string;
  isExecutable: boolean;
  content: string;
  description: string;
  defaultArgs?: string;
  defaultInputs?: string[];
  run: (args: string[], inputs: string[]) => Promise<{ lines: string[]; exitCode: number }>;
}

const BUILTIN_SCRIPTS: Record<string, ScriptFile> = {
  'himom.sh': {
    name: 'himom.sh',
    isExecutable: false,
    description: 'Episode 1: Your very first automated Bash script with shebang and sleep delay.',
    content: `#!/bin/bash
# EP 1: NetworkChuck - Hi Mom Script!
echo "Hi Mom!"
sleep 1
echo "Uh, uh..."
sleep 1
echo "Oh wow, you look so good today!"
sleep 1
echo "I can't believe that's really you! Love you bye!"
exit 0`,
    run: async () => {
      const lines = [
        'Hi Mom!',
        'Uh, uh...',
        'Oh wow, you look so good today!',
        "I can't believe that's really you! Love you bye!",
      ];
      return { lines, exitCode: 0 };
    },
  },
  'bestdayever.sh': {
    name: 'bestdayever.sh',
    isExecutable: false,
    description: 'Episode 2: The Bash Butler greeting machine using variables, read input, and positional arguments.',
    defaultArgs: 'Chuck coffee',
    defaultInputs: ['Chuck', 'coffee'],
    content: `#!/bin/bash
# EP 2: The Bash Butler - Variables & Arguments
# Usage: ./bestdayever.sh [NAME] [COMPLIMENT]

name=$1
compliment=$2

if [ -z "$name" ]; then
  read -p "What is your name? " name
fi

if [ -z "$compliment" ]; then
  read -p "What makes you awesome today? " compliment
fi

user=$(whoami)
date_now=$(date +"%A, %B %d")
where_am_i=$(pwd)

echo "Good morning $name!!"
sleep 1
echo "Looking good today, $name!"
sleep 1
echo "You have the best $compliment I've ever seen, $name!"
echo ""
echo "=== System Status for $user ==="
echo "Date: $date_now"
echo "Directory: $where_am_i"
exit 0`,
    run: async (args, inputs) => {
      const name = args[0] || inputs[0] || 'Chuck';
      const comp = args[1] || inputs[1] || 'coffee';
      return {
        lines: [
          `Good morning ${name}!!`,
          `Looking good today, ${name}!`,
          `You have the best ${comp} I've ever seen, ${name}!`,
          '',
          `=== System Status for student ===`,
          `Date: Wednesday, October 07`,
          `Directory: /home/student/bash-lab`,
        ],
        exitCode: 0,
      };
    },
  },
  'getrichquick.sh': {
    name: 'getrichquick.sh',
    isExecutable: false,
    description: 'Episode 3: Millionaire Math - $RANDOM, arithmetic expansion $(( )), and system environment variables.',
    defaultInputs: ['Chuck', '32'],
    content: `#!/bin/bash
# EP 3: The Millionaire Predictor
echo "What is your name?"
read name
echo "How old are you?"
read age

echo "Calculating your fortune for user: $USER on $HOSTNAME..."
sleep 1

# Random calculation: pseudo-random number 0-14 added to age
getrich=$(( ($RANDOM % 15) + $age ))

echo "-----------------------------------------------"
echo "Hello $name, you are currently $age years old."
echo "According to the Bash Oracle..."
sleep 1
echo "🎉 You will become a MILLIONAIRE at age $getrich!"
echo "-----------------------------------------------"
exit 0`,
    run: async (_, inputs) => {
      const name = inputs[0] || 'Chuck';
      const ageNum = parseInt(inputs[1] || '32', 10) || 32;
      const randOffset = Math.floor(Math.random() * 15);
      const getrich = ageNum + randOffset;
      return {
        lines: [
          'What is your name?',
          `> ${name}`,
          'How old are you?',
          `> ${ageNum}`,
          'Calculating your fortune for user: student on bash-cloud-vm...',
          '-----------------------------------------------',
          `Hello ${name}, you are currently ${ageNum} years old.`,
          'According to the Bash Oracle...',
          `🎉 You will become a MILLIONAIRE at age ${getrich}!`,
          '-----------------------------------------------',
        ],
        exitCode: 0,
      };
    },
  },
  'eldenring.sh': {
    name: 'eldenring.sh',
    isExecutable: false,
    description: 'Episode 4: Elden Ring Text RPG - Conditionals (if, elif, else), test operators, and coffee cheat codes!',
    defaultInputs: ['Tarnished', 'coffee'],
    content: `#!/bin/bash
# EP 4: Elden Ring in Bash
echo "=== WELCOME TO ELDEN RING (BASH EDITION) ==="
echo "Select your class:"
echo "1) Tarnished  2) Mage  3) Coffee Bandit"
read -p "Enter class: " hero_class

# Boss Battle 1: Margit the Fell Omen
beast=$(( $RANDOM % 2 ))

echo ""
echo "A foul beast approaches: Margit the Fell Omen!"
echo "Pick a number between 0 and 1. (0/1)"
read -p "Your roll: " tarnished

if [ "$tarnished" == "coffee" ]; then
  echo "☕ COFFEE CHEAT ACTIVATED! Instant death to all enemies!"
  echo "You defeated Margit with the power of caffeine!"
  exit 0
elif [ "$beast" == "$tarnished" ]; then
  echo "⚔️ Direct hit! Beast roll was $beast. You slashed Margit down!"
  echo "VICTORY ACHIEVED! You survived the encounter!"
  exit 0
else
  echo "💀 Beast roll was $beast. Margit strikes you down with a golden cane!"
  echo "YOU DIED."
  exit 1
fi`,
    run: async (_, inputs) => {
      const heroClass = inputs[0] || 'Tarnished';
      const rollInput = inputs[1] || '0';
      const beastRoll = Math.floor(Math.random() * 2);

      const lines = [
        '=== WELCOME TO ELDEN RING (BASH EDITION) ===',
        `Hero chosen: ${heroClass}`,
        '',
        'A foul beast approaches: Margit the Fell Omen!',
        `Your battle choice: ${rollInput}`,
      ];

      if (rollInput.toLowerCase() === 'coffee') {
        lines.push('☕ COFFEE CHEAT ACTIVATED! Instant death to all enemies!');
        lines.push('You defeated Margit with the power of caffeine!');
        lines.push('👑 ELDEN LORD VICTORY!');
        return { lines, exitCode: 0 };
      }

      if (rollInput === String(beastRoll)) {
        lines.push(`⚔️ Direct hit! Beast roll was ${beastRoll}. You slashed Margit down!`);
        lines.push('VICTORY ACHIEVED! You survived the encounter!');
        return { lines, exitCode: 0 };
      } else {
        lines.push(`💀 Beast roll was ${beastRoll}. Margit strikes you down with a golden cane!`);
        lines.push('YOU DIED.');
        return { lines, exitCode: 1 };
      }
    },
  },
  'pushups.sh': {
    name: 'pushups.sh',
    isExecutable: false,
    description: 'Episode 5: The Fitness Push-up Loop - While and until loops, increment counters, and rest intervals.',
    defaultArgs: '5',
    content: `#!/bin/bash
# EP 5: Bash Push-Up Counter for #gains
reps=\${1:-5}
x=1

echo "💪 Starting workout! Target: $reps push-ups!"
echo "Get in position..."
sleep 1

while [ $x -le $reps ]; do
  read -p "Push-up #$x: Press [Enter] when done... "
  echo "✅ Rep $x completed! Feel the burn!"
  x=$(( x + 1 ))
done

echo "-----------------------------------"
echo "🔥 CONGRATULATIONS! You crushed all $reps push-ups!"
echo "Gains successfully logged in /var/log/fitness.log."
exit 0`,
    run: async (args) => {
      const reps = parseInt(args[0] || '5', 10) || 5;
      const count = Math.min(reps, 10);
      const lines = [`💪 Starting workout! Target: ${reps} push-ups!`, 'Get in position...'];
      for (let i = 1; i <= count; i++) {
        lines.push(`✅ Rep ${i} completed! [Enter pressed] Feel the burn!`);
      }
      lines.push('-----------------------------------');
      lines.push(`🔥 CONGRATULATIONS! You crushed all ${reps} push-ups!`);
      lines.push('Gains successfully logged.');
      return { lines, exitCode: 0 };
    },
  },
  'pingsweep.sh': {
    name: 'pingsweep.sh',
    isExecutable: false,
    description: 'Bonus: Subnet Ping Sweeper - For loops iterating over IP range {1..10} and testing connectivity.',
    defaultArgs: '192.168.1',
    content: `#!/bin/bash
# Subnet Ping Sweeper
subnet=\${1:-192.168.1}

echo "🔍 Scanning subnet $subnet.0/24..."
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo "-------------------------------------"

for host in {1..6}; do
  ip="$subnet.$host"
  # Simulate ping test
  if [ "$host" -eq 1 ] || [ "$host" -eq 4 ] || [ "$host" -eq 6 ]; then
    echo "🟢 Host is UP: $ip (latency: $(( host * 4 + 2 ))ms)"
  else
    echo "🔴 Host is DOWN: $ip (timeout)"
  fi
done

echo "-------------------------------------"
echo "Scan complete. 3 alive hosts discovered."
exit 0`,
    run: async (args) => {
      const subnet = args[0] || '192.168.1';
      const lines = [
        `🔍 Scanning subnet ${subnet}.0/24...`,
        `Timestamp: 2026-10-07 18:30:00`,
        '-------------------------------------',
        `🟢 Host is UP: ${subnet}.1 (Gateway - latency: 2ms)`,
        `🔴 Host is DOWN: ${subnet}.2 (timeout)`,
        `🔴 Host is DOWN: ${subnet}.3 (timeout)`,
        `🟢 Host is UP: ${subnet}.4 (WebServer - latency: 14ms)`,
        `🔴 Host is DOWN: ${subnet}.5 (timeout)`,
        `🟢 Host is UP: ${subnet}.6 (Database - latency: 22ms)`,
        '-------------------------------------',
        'Scan complete. 3 alive hosts discovered.',
      ];
      return { lines, exitCode: 0 };
    },
  },
  'backup.sh': {
    name: 'backup.sh',
    isExecutable: false,
    description: 'Production Defensive Script - set -euo pipefail, trap on EXIT, and tar compression simulation.',
    content: `#!/bin/bash
# Defensive Production Backup Engine
set -euo pipefail

BACKUP_DIR="/var/backups/web"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE="app_backup_\${TIMESTAMP}.tar.gz"

cleanup() {
  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    echo "❌ Backup aborted with error code $exit_code!"
  else
    echo "✨ Cleanup complete. Backup successful!"
  fi
}
trap cleanup EXIT

echo "📦 Preparing backup archive: $ARCHIVE"
echo "Compressing files from /var/www/html..."
sleep 1
echo "✅ Compressed 1,420 files (48MB -> 12MB)"
echo "Writing SHA256 checksum..."
echo "Backup stored safely at $BACKUP_DIR/$ARCHIVE"
exit 0`,
    run: async () => {
      return {
        lines: [
          '📦 Preparing backup archive: app_backup_20261007_183000.tar.gz',
          'Compressing files from /var/www/html...',
          '✅ Compressed 1,420 files (48MB -> 12MB)',
          'Writing SHA256 checksum: 9e107d9d372bb6826bd81d3542a419d6',
          'Backup stored safely at /var/backups/web/app_backup_20261007_183000.tar.gz',
          '✨ Cleanup complete. Backup successful!',
        ],
        exitCode: 0,
      };
    },
  },
};

export function BashSimulator() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'runner' | 'tester'>('runner');
  const [scripts, setScripts] = useState<Record<string, ScriptFile>>(BUILTIN_SCRIPTS);
  const [selectedScriptKey, setSelectedScriptKey] = useState<string>('eldenring.sh');

  // Runner state
  const [scriptArgs, setScriptArgs] = useState<string>('');
  const [scriptInputs, setScriptInputs] = useState<string[]>([]);
  const [runnerOutput, setRunnerOutput] = useState<string[]>([]);
  const [runnerExitCode, setRunnerExitCode] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd?: string; output: string[]; isError?: boolean }>>([
    {
      output: [
        'Welcome to the Interactive Bash Learning Shell! (GNU bash, version 5.2.21-release)',
        'Type "help" to see available commands, or explore scripts with "ls -l".',
        'Tip: Make scripts executable with "chmod +x <script>" before running "./<script>".',
      ],
    },
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState<number>(-1);
  const [sentCommands, setSentCommands] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Tester state
  const [testExprType, setTestExprType] = useState<'cond' | 'arith' | 'param'>('cond');
  const [testInput, setTestInput] = useState<string>('[ 5 -gt 2 ]');
  const [testResult, setTestResult] = useState<{ out: string; success: boolean } | null>(null);

  // Sync script defaults when selected script changes
  useEffect(() => {
    const s = scripts[selectedScriptKey];
    if (s) {
      setScriptArgs(s.defaultArgs || '');
      setScriptInputs(s.defaultInputs ? [...s.defaultInputs] : []);
      setRunnerOutput([]);
      setRunnerExitCode(null);
    }
  }, [selectedScriptKey, scripts]);

  // Scroll terminal
  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, activeTab]);

  // Execute from Script Runner
  const handleRunScript = async () => {
    const s = scripts[selectedScriptKey];
    if (!s || isRunning) return;

    setIsRunning(true);
    setRunnerOutput([`$ ./${s.name} ${scriptArgs}`.trim()]);
    setRunnerExitCode(null);

    // If script not executable in virtual fs
    if (!s.isExecutable) {
      setTimeout(() => {
        setRunnerOutput((prev) => [
          ...prev,
          `bash: ./${s.name}: Permission denied (missing +x execute bit!)`,
          `Hint: Toggle "+x Executable" permission below or run "chmod +x ${s.name}"`,
        ]);
        setRunnerExitCode(126);
        setIsRunning(false);
      }, 300);
      return;
    }

    const argsList = scriptArgs.trim() ? scriptArgs.trim().split(/\s+/) : [];
    const result = await s.run(argsList, scriptInputs);

    // Stream lines with small delay for realistic terminal feel
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < result.lines.length) {
        const line = result.lines[idx];
        setRunnerOutput((prev) => [...prev, line]);
        idx++;
      } else {
        clearInterval(interval);
        setRunnerExitCode(result.exitCode);
        setIsRunning(false);
      }
    }, 180);
  };

  // Toggle execute permission
  const toggleExecutable = (name: string) => {
    setScripts((prev) => {
      const cur = prev[name];
      if (!cur) return prev;
      return {
        ...prev,
        [name]: {
          ...cur,
          isExecutable: !cur.isExecutable,
        },
      };
    });
  };

  // Terminal command handler
  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = terminalInput.trim();
    if (!rawCmd) return;

    setSentCommands((prev) => [...prev, rawCmd]);
    setCmdHistoryIndex(-1);
    setTerminalInput('');

    const tokens = rawCmd.split(/\s+/);
    const cmd = tokens[0];
    const args = tokens.slice(1);

    const newHistoryItem: { cmd: string; output: string[]; isError?: boolean } = {
      cmd: rawCmd,
      output: [],
    };

    if (cmd === 'clear') {
      setTerminalHistory([]);
      return;
    }

    if (cmd === 'help') {
      newHistoryItem.output = [
        'Available built-in simulator commands:',
        '  ls [-l]             - List lab files & permissions',
        '  chmod +x <file>     - Mark script as executable',
        '  chmod -x <file>     - Remove execute permission',
        '  cat <file>          - Display script source code',
        '  ./<script> [args]   - Execute script directly',
        '  bash <script> [args]- Run script with bash interpreter',
        '  echo <text/$VAR>    - Print text or env variable ($USER, $SHELL, $RANDOM, $PWD, $SECONDS)',
        '  whoami / pwd / date - Core system information',
        '  clear / help        - Manage terminal window',
      ];
      setTerminalHistory((prev) => [...prev, newHistoryItem]);
      return;
    }

    if (cmd === 'ls') {
      const isLong = args.includes('-l') || args.includes('-la');
      if (isLong) {
        const lines = [
          'total 36',
          'drwxr-xr-x 2 student student 4096 Oct  7 18:00 .',
          'drwxr-xr-x 4 student student 4096 Oct  7 17:00 ..',
        ];
        Object.values(scripts).forEach((sc) => {
          const perm = sc.isExecutable ? '-rwxr-xr-x' : '-rw-r--r--';
          lines.push(`${perm} 1 student student 1024 Oct  7 18:20 ${sc.name}`);
        });
        lines.push('-rw-r--r-- 1 student student  350 Oct  7 18:05 servers.txt');
        lines.push('-rw-r--r-- 1 student student  120 Oct  7 18:10 notes.txt');
        newHistoryItem.output = lines;
      } else {
        const names = Object.values(scripts)
          .map((s) => (s.isExecutable ? `${s.name}*` : s.name))
          .concat(['servers.txt', 'notes.txt']);
        newHistoryItem.output = [names.join('  ')];
      }
      setTerminalHistory((prev) => [...prev, newHistoryItem]);
      return;
    }

    if (cmd === 'chmod') {
      const mode = args[0];
      const target = args[1];
      if (!mode || !target || !scripts[target]) {
        newHistoryItem.output = [`chmod: missing operand or file not found '${target || ''}'`];
        newHistoryItem.isError = true;
      } else if (mode === '+x') {
        toggleExecutable(target);
        newHistoryItem.output = [`mode of '${target}' changed to 0755 (rwxr-xr-x)`];
      } else if (mode === '-x') {
        toggleExecutable(target);
        newHistoryItem.output = [`mode of '${target}' changed to 0644 (rw-r--r--)`];
      } else {
        newHistoryItem.output = [`chmod: invalid mode: '${mode}'`];
        newHistoryItem.isError = true;
      }
      setTerminalHistory((prev) => [...prev, newHistoryItem]);
      return;
    }

    if (cmd === 'cat') {
      const target = args[0];
      if (!target) {
        newHistoryItem.output = ['cat: missing file operand'];
        newHistoryItem.isError = true;
      } else if (target === 'servers.txt') {
        newHistoryItem.output = ['192.168.1.1', '192.168.1.4', '192.168.1.6', '10.0.0.15'];
      } else if (target === 'notes.txt') {
        newHistoryItem.output = ['Bash rule #1: No spaces around variable assignment (name="Bob")'];
      } else if (scripts[target]) {
        newHistoryItem.output = scripts[target].content.split('\n');
      } else {
        newHistoryItem.output = [`cat: ${target}: No such file or directory`];
        newHistoryItem.isError = true;
      }
      setTerminalHistory((prev) => [...prev, newHistoryItem]);
      return;
    }

    if (cmd === 'whoami') {
      newHistoryItem.output = ['student'];
      setTerminalHistory((prev) => [...prev, newHistoryItem]);
      return;
    }

    if (cmd === 'pwd') {
      newHistoryItem.output = ['/home/student/bash-lab'];
      setTerminalHistory((prev) => [...prev, newHistoryItem]);
      return;
    }

    if (cmd === 'date') {
      newHistoryItem.output = [new Date().toUTCString()];
      setTerminalHistory((prev) => [...prev, newHistoryItem]);
      return;
    }

    if (cmd === 'echo') {
      const rest = args.join(' ');
      if (rest.includes('$RANDOM')) {
        const randVal = Math.floor(Math.random() * 32767);
        newHistoryItem.output = [rest.replace(/\$RANDOM/g, String(randVal))];
      } else if (rest.includes('$USER')) {
        newHistoryItem.output = [rest.replace(/\$USER/g, 'student')];
      } else if (rest.includes('$SHELL')) {
        newHistoryItem.output = [rest.replace(/\$SHELL/g, '/bin/bash')];
      } else if (rest.includes('$PWD')) {
        newHistoryItem.output = [rest.replace(/\$PWD/g, '/home/student/bash-lab')];
      } else if (rest.includes('$HOSTNAME')) {
        newHistoryItem.output = [rest.replace(/\$HOSTNAME/g, 'bash-cloud-node-01')];
      } else if (rest.includes('$SECONDS')) {
        newHistoryItem.output = [rest.replace(/\$SECONDS/g, '42')];
      } else {
        // Strip outer quotes if any
        newHistoryItem.output = [rest.replace(/^["']|["']$/g, '')];
      }
      setTerminalHistory((prev) => [...prev, newHistoryItem]);
      return;
    }

    // Executing scripts via ./script.sh or bash script.sh
    let targetScript = '';
    let isBashDirect = false;

    if (cmd.startsWith('./')) {
      targetScript = cmd.replace('./', '');
    } else if (cmd === 'bash' && args[0]) {
      targetScript = args[0];
      isBashDirect = true;
    }

    if (targetScript && scripts[targetScript]) {
      const sc = scripts[targetScript];
      if (!isBashDirect && !sc.isExecutable) {
        newHistoryItem.output = [
          `bash: ./${targetScript}: Permission denied`,
          `Hint: Run 'chmod +x ${targetScript}' or use 'bash ${targetScript}'`,
        ];
        newHistoryItem.isError = true;
      } else {
        const scriptPassedArgs = isBashDirect ? args.slice(1) : args;
        const res = await sc.run(scriptPassedArgs, sc.defaultInputs || []);
        newHistoryItem.output = res.lines;
      }
      setTerminalHistory((prev) => [...prev, newHistoryItem]);
      return;
    }

    // Unrecognized command
    newHistoryItem.output = [`bash: ${cmd}: command not found. Type 'help' for options.`];
    newHistoryItem.isError = true;
    setTerminalHistory((prev) => [...prev, newHistoryItem]);
  };

  // Evaluate expressions in Tester tab
  const handleEvaluateTester = () => {
    const expr = testInput.trim();
    if (!expr) return;

    if (testExprType === 'cond') {
      // Test conditional like [ 5 -gt 2 ] or [ "a" == "a" ]
      let isTrue = false;
      let explanation = '';

      if (expr.includes('-gt')) {
        const match = expr.match(/(\d+)\s+-gt\s+(\d+)/);
        if (match) {
          isTrue = parseInt(match[1], 10) > parseInt(match[2], 10);
          explanation = `${match[1]} > ${match[2]} evaluates to ${isTrue ? 'True' : 'False'}`;
        }
      } else if (expr.includes('-lt')) {
        const match = expr.match(/(\d+)\s+-lt\s+(\d+)/);
        if (match) {
          isTrue = parseInt(match[1], 10) < parseInt(match[2], 10);
          explanation = `${match[1]} < ${match[2]} evaluates to ${isTrue ? 'True' : 'False'}`;
        }
      } else if (expr.includes('-eq')) {
        const match = expr.match(/(\d+)\s+-eq\s+(\d+)/);
        if (match) {
          isTrue = parseInt(match[1], 10) === parseInt(match[2], 10);
          explanation = `${match[1]} == ${match[2]} evaluates to ${isTrue ? 'True' : 'False'}`;
        }
      } else if (expr.includes('==')) {
        const match = expr.match(/["']?([^"'\s]+)["']?\s*==\s*["']?([^"'\s]+)["']?/);
        if (match) {
          isTrue = match[1] === match[2];
          explanation = `"${match[1]}" equals "${match[2]}": ${isTrue ? 'True' : 'False'}`;
        }
      } else if (expr.includes('-f') || expr.includes('-e')) {
        isTrue = expr.includes('himom.sh') || expr.includes('bestdayever.sh');
        explanation = `File existence check: ${isTrue ? 'File exists in current lab' : 'File does not exist'}`;
      } else if (expr.includes('-z')) {
        isTrue = expr.includes('""') || expr.includes("''");
        explanation = `String is empty (-z): ${isTrue ? 'True' : 'False'}`;
      } else {
        isTrue = true;
        explanation = 'Expression evaluated cleanly with exit status 0';
      }

      setTestResult({
        out: `Exit code: ${isTrue ? '0 (TRUE)' : '1 (FALSE)'}\nDetails: ${explanation}`,
        success: isTrue,
      });
    } else if (testExprType === 'arith') {
      try {
        // Clean out $(( and )) if entered
        const clean = expr.replace(/^\$\(\(/, '').replace(/\)\)$/, '').replace(/\$RANDOM/g, '42');
        // Simple safe evaluator for math operators
        const sanitized = clean.replace(/[^0-9+\-*/%().\s]/g, '');
        // eslint-disable-next-line no-eval
        const val = Function(`'use strict'; return (${sanitized})`)();
        setTestResult({
          out: `$(( ${expr} )) = ${val}\nExit status: 0 (Arithmetic success)`,
          success: true,
        });
      } catch {
        setTestResult({
          out: `bash: arithmetic error in expression '${expr}'\nExit status: 1`,
          success: false,
        });
      }
    } else if (testExprType === 'param') {
      // Parameter expansion tester
      if (expr.includes(':-')) {
        const match = expr.match(/\${?(\w+):-([^}]+)}?/);
        const fallback = match ? match[2] : 'default_val';
        setTestResult({
          out: `Expression: ${expr}\nResult: "${fallback}" (Variable unset -> default used)\nExit status: 0`,
          success: true,
        });
      } else if (expr.includes('#')) {
        setTestResult({
          out: `Expression: ${expr}\nResult: 12 (Length of target string in characters)\nExit status: 0`,
          success: true,
        });
      } else {
        setTestResult({
          out: `Evaluated: "${expr}"\nPattern matched and expanded successfully.`,
          success: true,
        });
      }
    }
  };

  const currentScript = scripts[selectedScriptKey];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-lg transition-all">
      {/* Top Banner / Tab Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-fd-border bg-fd-muted/40 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Terminal className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-fd-foreground">
              Bash Scripting Simulator & Lab Bench
            </h3>
            <p className="text-[11px] text-fd-muted-foreground">
              Test real scripts from NetworkChuck's masterclass with live I/O and exit codes
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-lg border border-fd-border bg-fd-background p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('runner')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
              activeTab === 'runner'
                ? 'bg-fd-primary text-fd-primary-foreground shadow-sm'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            <Play className="size-3" /> Script Runner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
              activeTab === 'terminal'
                ? 'bg-fd-primary text-fd-primary-foreground shadow-sm'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            <Terminal className="size-3" /> Terminal Shell
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tester')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
              activeTab === 'tester'
                ? 'bg-fd-primary text-fd-primary-foreground shadow-sm'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            <Sliders className="size-3" /> Syntax Tester
          </button>
        </div>
      </div>

      {/* TAB 1: SCRIPT RUNNER */}
      {activeTab === 'runner' && (
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left Column: Script Selection & Config */}
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
                  Select Script Lab
                </label>
                <select
                  value={selectedScriptKey}
                  onChange={(e) => setSelectedScriptKey(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-xs font-medium text-fd-foreground shadow-sm focus:border-fd-primary focus:outline-none"
                >
                  {Object.entries(scripts).map(([key, s]) => (
                    <option key={key} value={key}>
                      {s.name} — {s.name === 'himom.sh' ? 'Hi Mom (Ep 1)' : ''}
                      {s.name === 'bestdayever.sh' ? 'Best Day Ever / Butler (Ep 2)' : ''}
                      {s.name === 'getrichquick.sh' ? 'Millionaire Math (Ep 3)' : ''}
                      {s.name === 'eldenring.sh' ? 'Elden Ring RPG (Ep 4)' : ''}
                      {s.name === 'pushups.sh' ? 'Push-up Loop (Ep 5)' : ''}
                      {s.name === 'pingsweep.sh' ? 'Subnet Ping Sweeper' : ''}
                      {s.name === 'backup.sh' ? 'Defensive Backup Engine' : ''}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-fd-muted-foreground">
                  {currentScript.description}
                </p>
              </div>

              {/* Executable bit indicator and toggle */}
              <div className="flex items-center justify-between rounded-lg border border-fd-border bg-fd-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`size-2.5 rounded-full ${
                      currentScript.isExecutable ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <div>
                    <span className="text-xs font-semibold text-fd-foreground">
                      Mode: {currentScript.isExecutable ? '-rwxr-xr-x (0755)' : '-rw-r--r-- (0644)'}
                    </span>
                    <p className="text-[10px] text-fd-muted-foreground">
                      {currentScript.isExecutable
                        ? 'Executable bit (+x) active — can run with ./'
                        : 'Non-executable — requires chmod +x to run'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExecutable(selectedScriptKey)}
                  className={`rounded-md px-2 py-1 text-[11px] font-bold transition-all ${
                    currentScript.isExecutable
                      ? 'border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                      : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {currentScript.isExecutable ? 'Remove +x' : 'chmod +x'}
                </button>
              </div>

              {/* Positional Args */}
              <div>
                <label className="text-xs font-semibold text-fd-foreground">
                  Command-Line Arguments ($1, $2...)
                </label>
                <input
                  type="text"
                  value={scriptArgs}
                  onChange={(e) => setScriptArgs(e.target.value)}
                  placeholder="e.g. Chuck coffee"
                  className="mt-1 w-full rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 font-mono text-xs text-fd-foreground focus:border-fd-primary focus:outline-none"
                />
              </div>

              {/* Interactive Inputs */}
              {currentScript.defaultInputs && (
                <div>
                  <label className="text-xs font-semibold text-fd-foreground">
                    Interactive `read` Inputs (Simulated stdin)
                  </label>
                  <div className="mt-1 flex flex-col gap-2">
                    {scriptInputs.map((val, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-16 font-mono text-[11px] text-fd-muted-foreground">
                          Input #{idx + 1}:
                        </span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const next = [...scriptInputs];
                            next[idx] = e.target.value;
                            setScriptInputs(next);
                          }}
                          className="flex-1 rounded-lg border border-fd-border bg-fd-background px-2.5 py-1 font-mono text-xs text-fd-foreground focus:border-fd-primary focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={handleRunScript}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 disabled:opacity-50"
                >
                  <Play className="size-3.5" />
                  {isRunning ? 'Executing script...' : 'Run Script'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRunnerOutput([]);
                    setRunnerExitCode(null);
                  }}
                  className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-xs font-semibold text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Code & Live Execution Output */}
            <div className="flex flex-col gap-4 lg:col-span-7">
              {/* Code preview */}
              <div className="overflow-hidden rounded-xl border border-fd-border bg-zinc-950 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <FileCode className="size-3.5 text-emerald-400" />
                    <span>{currentScript.name}</span>
                  </div>
                  <span>Bash Shell Script</span>
                </div>
                <div className="max-h-56 overflow-y-auto p-3 text-zinc-300">
                  <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">
                    {currentScript.content}
                  </pre>
                </div>
              </div>

              {/* Simulated Terminal Output */}
              <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-black font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-zinc-300">Terminal stdout / stderr</span>
                  </div>
                  {runnerExitCode !== null && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        runnerExitCode === 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      Exit Code: {runnerExitCode} {runnerExitCode === 0 ? '(Success)' : '(Error)'}
                    </span>
                  )}
                </div>

                <div className="min-h-36 flex-1 overflow-y-auto p-3 text-zinc-200">
                  {runnerOutput.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center text-center text-zinc-500">
                      <Terminal className="size-8 opacity-40" />
                      <p className="mt-2 text-xs">Ready to run. Click &quot;Run Script&quot; to execute.</p>
                      <p className="text-[10px] text-zinc-600">
                        Notice how exit codes and stdout appear in real time.
                      </p>
                    </div>
                  ) : (
                    runnerOutput.map((line, i) => (
                      <div
                        key={i}
                        className={`leading-relaxed ${
                          line.startsWith('$')
                            ? 'text-emerald-400 font-bold'
                            : line.includes('Permission denied') || line.includes('error') || line.includes('DIED')
                            ? 'text-red-400'
                            : line.includes('🎉') || line.includes('VICTORY') || line.includes('🔥')
                            ? 'text-yellow-300 font-semibold'
                            : 'text-zinc-300'
                        }`}
                      >
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE TERMINAL */}
      {activeTab === 'terminal' && (
        <div className="flex flex-col bg-zinc-950 font-mono text-xs text-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-500" />
              <span className="size-2.5 rounded-full bg-yellow-500" />
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="ml-2 font-semibold text-zinc-300">student@bash-cloud-vm: ~/bash-lab</span>
            </div>
            <button
              type="button"
              onClick={() => setTerminalHistory([])}
              className="text-xs hover:text-zinc-200"
            >
              Clear
            </button>
          </div>

          {/* Terminal stream */}
          <div className="max-h-[380px] min-h-[300px] overflow-y-auto p-4 space-y-3">
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="space-y-1">
                {item.cmd && (
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-emerald-400 font-bold">student@bash-lab:~$</span>
                    <span className="text-zinc-100 font-semibold">{item.cmd}</span>
                  </div>
                )}
                {item.output.map((outLine, oIdx) => (
                  <div
                    key={oIdx}
                    className={`leading-relaxed whitespace-pre-wrap ${
                      item.isError ? 'text-red-400' : 'text-zinc-300'
                    }`}
                  >
                    {outLine}
                  </div>
                ))}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Bar */}
          <form
            onSubmit={handleTerminalSubmit}
            className="flex items-center border-t border-zinc-800 bg-zinc-900/60 px-3 py-2"
          >
            <span className="text-emerald-400 font-bold mr-2">student@bash-lab:~$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  if (sentCommands.length > 0) {
                    const nextIdx =
                      cmdHistoryIndex === -1 ? sentCommands.length - 1 : Math.max(0, cmdHistoryIndex - 1);
                    setCmdHistoryIndex(nextIdx);
                    setTerminalInput(sentCommands[nextIdx]);
                  }
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  if (cmdHistoryIndex !== -1) {
                    const nextIdx = cmdHistoryIndex + 1;
                    if (nextIdx >= sentCommands.length) {
                      setCmdHistoryIndex(-1);
                      setTerminalInput('');
                    } else {
                      setCmdHistoryIndex(nextIdx);
                      setTerminalInput(sentCommands[nextIdx]);
                    }
                  }
                }
              }}
              placeholder="Try: ls -l, chmod +x himom.sh, ./himom.sh, echo $RANDOM, or help"
              className="flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600"
              autoFocus
            />
            <button
              type="submit"
              className="ml-2 rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SYNTAX TESTER & EVALUATOR */}
      {activeTab === 'tester' && (
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className="flex flex-col gap-3 md:col-span-5">
              <label className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
                Choose Evaluation Type
              </label>
              <div className="grid grid-cols-3 gap-1 rounded-lg border border-fd-border bg-fd-background p-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setTestExprType('cond');
                    setTestInput('[ 42 -gt 10 ]');
                    setTestResult(null);
                  }}
                  className={`rounded py-1 text-center font-medium ${
                    testExprType === 'cond' ? 'bg-fd-primary text-fd-primary-foreground' : 'text-fd-muted-foreground'
                  }`}
                >
                  Conditionals
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTestExprType('arith');
                    setTestInput('(( ($RANDOM % 15) + 32 ))');
                    setTestResult(null);
                  }}
                  className={`rounded py-1 text-center font-medium ${
                    testExprType === 'arith' ? 'bg-fd-primary text-fd-primary-foreground' : 'text-fd-muted-foreground'
                  }`}
                >
                  Arithmetic
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTestExprType('param');
                    setTestInput('${PORT:-8080}');
                    setTestResult(null);
                  }}
                  className={`rounded py-1 text-center font-medium ${
                    testExprType === 'param' ? 'bg-fd-primary text-fd-primary-foreground' : 'text-fd-muted-foreground'
                  }`}
                >
                  Parameter
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-fd-foreground">
                  Expression to Test
                </label>
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 font-mono text-xs text-fd-foreground focus:border-fd-primary focus:outline-none"
                />
              </div>

              {/* Preset quick buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {testExprType === 'cond' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setTestInput('[ "$role" == "admin" ]')}
                      className="rounded border border-fd-border bg-fd-muted px-2 py-0.5 text-[10px] text-fd-muted-foreground hover:text-fd-foreground"
                    >
                      [ &quot;$role&quot; == &quot;admin&quot; ]
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestInput('[ -f "himom.sh" ]')}
                      className="rounded border border-fd-border bg-fd-muted px-2 py-0.5 text-[10px] text-fd-muted-foreground hover:text-fd-foreground"
                    >
                      [ -f &quot;himom.sh&quot; ]
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestInput('[ -z "" ]')}
                      className="rounded border border-fd-border bg-fd-muted px-2 py-0.5 text-[10px] text-fd-muted-foreground hover:text-fd-foreground"
                    >
                      [ -z &quot;&quot; ]
                    </button>
                  </>
                )}
                {testExprType === 'arith' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setTestInput('(( 10 * 5 + 2 ))')}
                      className="rounded border border-fd-border bg-fd-muted px-2 py-0.5 text-[10px] text-fd-muted-foreground hover:text-fd-foreground"
                    >
                      (( 10 * 5 + 2 ))
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestInput('(( ($RANDOM % 6) + 1 ))')}
                      className="rounded border border-fd-border bg-fd-muted px-2 py-0.5 text-[10px] text-fd-muted-foreground hover:text-fd-foreground"
                    >
                      Dice Roll (( $RANDOM % 6 + 1 ))
                    </button>
                  </>
                )}
                {testExprType === 'param' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setTestInput('${DATABASE_HOST:-localhost}')}
                      className="rounded border border-fd-border bg-fd-muted px-2 py-0.5 text-[10px] text-fd-muted-foreground hover:text-fd-foreground"
                    >
                      {"${DB:-localhost}"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestInput('${#my_long_password}')}
                      className="rounded border border-fd-border bg-fd-muted px-2 py-0.5 text-[10px] text-fd-muted-foreground hover:text-fd-foreground"
                    >
                      String Length {"${#str}"}
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleEvaluateTester}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-xs font-semibold text-fd-primary-foreground hover:opacity-90"
              >
                <Zap className="size-3.5" /> Evaluate Expression
              </button>
            </div>

            {/* Tester Result Box */}
            <div className="flex flex-col rounded-xl border border-fd-border bg-fd-muted/30 p-4 md:col-span-7">
              <span className="text-xs font-bold text-fd-foreground">Evaluation Feedback</span>
              <div className="mt-2 flex-1 rounded-lg border border-fd-border bg-fd-background p-3 font-mono text-xs">
                {testResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold ${
                          testResult.success
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {testResult.success ? <Check className="size-3" /> : <X className="size-3" />}
                        {testResult.success ? 'Evaluation Passed' : 'Evaluation Failed'}
                      </span>
                    </div>
                    <pre className="text-xs text-fd-foreground whitespace-pre-wrap">
                      {testResult.out}
                    </pre>
                  </div>
                ) : (
                  <div className="flex h-36 flex-col items-center justify-center text-center text-fd-muted-foreground">
                    <Sliders className="size-6 opacity-40" />
                    <p className="mt-2 text-xs">Enter an expression and click &quot;Evaluate Expression&quot;.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
