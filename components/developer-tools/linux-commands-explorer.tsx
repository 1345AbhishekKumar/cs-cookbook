'use client';

import React, { useState } from 'react';
import { Search, Terminal, ArrowRight, Filter } from 'lucide-react';

interface CommandItem {
  id: string;
  num: string;
  name: string;
  category: string;
  tagline: string;
  syntax: string;
}

const COMMANDS: CommandItem[] = [
  { id: 'whoami', num: '01', name: 'whoami', category: 'Navigation & Files', tagline: 'Prints the username of the currently logged-in user.', syntax: 'whoami' },
  { id: 'man', num: '02', name: 'man', category: 'Navigation & Files', tagline: 'Displays the reference documentation for any command.', syntax: 'man <command>' },
  { id: 'clear', num: '03', name: 'clear', category: 'Navigation & Files', tagline: 'Wipes the terminal screen clean.', syntax: 'clear [-x]' },
  { id: 'pwd', num: '04', name: 'pwd', category: 'Navigation & Files', tagline: 'Prints the absolute path to your current working directory.', syntax: 'pwd [-L | -P]' },
  { id: 'ls', num: '05', name: 'ls', category: 'Navigation & Files', tagline: 'Lists files and folders inside a directory.', syntax: 'ls [options] [path...]' },
  { id: 'cd', num: '06', name: 'cd', category: 'Navigation & Files', tagline: 'Changes your current working directory.', syntax: 'cd [directory]' },
  { id: 'mkdir', num: '07', name: 'mkdir', category: 'Navigation & Files', tagline: 'Creates one or more new directories.', syntax: 'mkdir [options] <directory...>' },
  { id: 'touch', num: '08', name: 'touch', category: 'Navigation & Files', tagline: 'Creates empty files or updates existing file timestamps.', syntax: 'touch [options] <file...>' },
  { id: 'rmdir', num: '09', name: 'rmdir', category: 'Navigation & Files', tagline: 'Removes empty directories only.', syntax: 'rmdir [options] <directory...>' },
  { id: 'rm', num: '10', name: 'rm', category: 'Navigation & Files', tagline: 'Permanently removes files and directories.', syntax: 'rm [options] <path...>' },
  { id: 'open', num: '11', name: 'open / xdg-open', category: 'Navigation & Files', tagline: 'Opens files/URLs with default GUI applications.', syntax: 'open <path> | xdg-open <path>' },
  { id: 'mv', num: '12', name: 'mv', category: 'Navigation & Files', tagline: 'Moves or renames files and directories.', syntax: 'mv [options] <source> <target>' },
  { id: 'cp', num: '13', name: 'cp', category: 'Navigation & Files', tagline: 'Copies files and directories.', syntax: 'cp [options] <source> <target>' },
  { id: 'head', num: '14', name: 'head', category: 'Reading Content', tagline: 'Outputs the first lines of a file (default 10).', syntax: 'head [-n lines] [file...]' },
  { id: 'tail', num: '15', name: 'tail', category: 'Reading Content', tagline: 'Outputs the last lines of a file (supports live follow -f).', syntax: 'tail [-n lines] [-f] [file...]' },
  { id: 'date', num: '16', name: 'date', category: 'Reading Content', tagline: 'Prints or formats current system date and time.', syntax: 'date [+format]' },
  { id: 'cat', num: '17', name: 'cat', category: 'Reading Content', tagline: 'Concatenates and displays file contents in standard output.', syntax: 'cat [options] [file...]' },
  { id: 'less', num: '18', name: 'less', category: 'Reading Content', tagline: 'Interactive terminal pager with search and backward scrolling.', syntax: 'less [options] <file>' },
  { id: 'echo', num: '19', name: 'echo', category: 'Reading Content', tagline: 'Prints text or variable values to standard output.', syntax: 'echo [options] [string...]' },
  { id: 'wc', num: '20', name: 'wc', category: 'Processing Text', tagline: 'Counts lines, words, and bytes in text.', syntax: 'wc [-l] [-w] [-c] [file...]' },
  { id: 'sort', num: '21', name: 'sort', category: 'Processing Text', tagline: 'Sorts lines of text alphabetically or numerically.', syntax: 'sort [options] [file...]' },
  { id: 'uniq', num: '22', name: 'uniq', category: 'Processing Text', tagline: 'Filters or reports adjacent repeated lines.', syntax: 'uniq [options] [file]' },
  { id: 'diff', num: '23', name: 'diff', category: 'Processing Text', tagline: 'Compares two files line by line.', syntax: 'diff [options] <file1> <file2>' },
  { id: 'find', num: '24', name: 'find', category: 'Processing Text', tagline: 'Searches directory trees by name, size, type, or modified time.', syntax: 'find [path] [expression]' },
  { id: 'grep', num: '25', name: 'grep', category: 'Processing Text', tagline: 'Searches text and files using regular expressions.', syntax: 'grep [options] <pattern> [file...]' },
  { id: 'du', num: '26', name: 'du', category: 'System & Processes', tagline: 'Estimates file and directory space usage.', syntax: 'du [-s] [-h] [path...]' },
  { id: 'df', num: '27', name: 'df', category: 'System & Processes', tagline: 'Reports disk space usage for all mounted filesystems.', syntax: 'df [-h]' },
  { id: 'history', num: '28', name: 'history', category: 'System & Processes', tagline: 'Displays the list of previously executed commands.', syntax: 'history [n]' },
  { id: 'ps', num: '29', name: 'ps', category: 'System & Processes', tagline: 'Snapshots currently active processes.', syntax: 'ps [aux | -ef]' },
  { id: 'top', num: '30', name: 'top', category: 'System & Processes', tagline: 'Live dynamic view of running system processes and resource load.', syntax: 'top' },
  { id: 'kill', num: '31', name: 'kill', category: 'System & Processes', tagline: 'Sends a termination signal to a process by PID.', syntax: 'kill [-signal] <PID...>' },
  { id: 'killall', num: '32', name: 'killall', category: 'System & Processes', tagline: 'Kills all processes matching a program name.', syntax: 'killall [-signal] <name...>' },
  { id: 'jobs', num: '33', name: 'jobs', category: 'System & Processes', tagline: 'Lists background jobs managed by the current shell.', syntax: 'jobs [-l]' },
  { id: 'bg', num: '34', name: 'bg', category: 'System & Processes', tagline: 'Resumes a suspended process in the background.', syntax: 'bg [%job_id]' },
  { id: 'fg', num: '35', name: 'fg', category: 'System & Processes', tagline: 'Brings a background process into the foreground.', syntax: 'fg [%job_id]' },
  { id: 'sleep', num: '36', name: 'sleep', category: 'System & Processes', tagline: 'Pauses execution for a specified duration of time.', syntax: 'sleep <number>[s|m|h|d]' },
  { id: 'gzip', num: '37', name: 'gzip', category: 'Archives & Editing', tagline: 'Compresses files using the LZ77 (gzip) algorithm.', syntax: 'gzip [options] <file...>' },
  { id: 'gunzip', num: '38', name: 'gunzip', category: 'Archives & Editing', tagline: 'Decompresses files created by gzip (.gz).', syntax: 'gunzip <file.gz...>' },
  { id: 'tar', num: '39', name: 'tar', category: 'Archives & Editing', tagline: 'Archives multiple files into a single tarball (.tar / .tar.gz).', syntax: 'tar [-czvf | -xzvf] <archive> [files...]' },
  { id: 'nano', num: '40', name: 'nano', category: 'Archives & Editing', tagline: 'Simple, beginner-friendly modeless command-line text editor.', syntax: 'nano [file]' },
  { id: 'alias', num: '41', name: 'alias', category: 'Archives & Editing', tagline: 'Creates shortcut nicknames for long commands.', syntax: 'alias [name="command"]' },
  { id: 'xargs', num: '42', name: 'xargs', category: 'Archives & Editing', tagline: 'Builds and executes commands from standard input arguments.', syntax: 'xargs [options] [command]' },
  { id: 'ln', num: '43', name: 'ln', category: 'Archives & Editing', tagline: 'Creates hard links or symbolic links between files.', syntax: 'ln [-s] <target> <link_name>' },
  { id: 'who', num: '44', name: 'who', category: 'Users & Permissions', tagline: 'Shows who is logged into the local machine.', syntax: 'who' },
  { id: 'su', num: '45', name: 'su', category: 'Users & Permissions', tagline: 'Switches shell session to another user or superuser.', syntax: 'su [-] [username]' },
  { id: 'sudo', num: '46', name: 'sudo', category: 'Users & Permissions', tagline: 'Executes a command with superuser / root privileges.', syntax: 'sudo <command>' },
  { id: 'passwd', num: '47', name: 'passwd', category: 'Users & Permissions', tagline: 'Changes user account passwords.', syntax: 'passwd [username]' },
  { id: 'chown', num: '48', name: 'chown', category: 'Users & Permissions', tagline: 'Changes file/folder owner and group ownership.', syntax: 'chown [-R] user[:group] <path...>' },
  { id: 'groups', num: '49', name: 'groups', category: 'Users & Permissions', tagline: 'Prints group memberships for a user.', syntax: 'groups [username]' },
  { id: 'chmod', num: '50', name: 'chmod', category: 'Users & Permissions', tagline: 'Modifies file read, write, and execute permissions.', syntax: 'chmod [options] <mode> <file...>' },
];

const CATEGORIES = [
  'All',
  'Navigation & Files',
  'Reading Content',
  'Processing Text',
  'System & Processes',
  'Archives & Editing',
  'Users & Permissions',
];

export function LinuxCommandsExplorer() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = COMMANDS.filter((cmd) => {
    const matchesCategory =
      activeCategory === 'All' || cmd.category === activeCategory;
    const matchesSearch =
      cmd.name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.tagline.toLowerCase().includes(search.toLowerCase()) ||
      cmd.syntax.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="size-5 text-fd-primary" />
            <h3 className="text-base font-semibold text-fd-foreground">
              Interactive 50 Linux Commands Explorer
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-fd-muted-foreground">
            Filter, search, and jump to any command’s reference, syntax, and examples.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-4 text-fd-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands or syntax..."
            className="w-full rounded-lg border border-fd-border bg-fd-background py-2 pl-9 pr-3 text-xs text-fd-foreground placeholder:text-fd-muted-foreground focus:border-fd-primary focus:outline-none focus:ring-1 focus:ring-fd-primary"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-fd-border pb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-fd-primary text-fd-primary-foreground'
                : 'bg-fd-muted/50 text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-fd-muted-foreground">
        <span>
          Showing <strong>{filtered.length}</strong> of {COMMANDS.length} commands
        </span>
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="text-fd-primary hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      <div className="mt-3 grid max-h-[420px] grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cmd) => (
          <a
            key={cmd.id}
            href={`#${cmd.id}`}
            className="group flex flex-col justify-between rounded-lg border border-fd-border bg-fd-background p-3 transition-colors hover:border-fd-primary/50 hover:bg-fd-muted/30"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-fd-muted-foreground">
                    #{cmd.num}
                  </span>
                  <span className="font-mono text-sm font-bold text-fd-primary group-hover:underline">
                    {cmd.name}
                  </span>
                </div>
                <span className="rounded bg-fd-muted px-1.5 py-0.5 text-[10px] text-fd-muted-foreground">
                  {cmd.category.split(' ')[0]}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs text-fd-muted-foreground">
                {cmd.tagline}
              </p>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-fd-border/50 pt-2 font-mono text-[11px] text-fd-foreground/80">
              <span className="truncate">{cmd.syntax}</span>
              <ArrowRight className="size-3 shrink-0 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
