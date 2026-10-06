'use client';

import React, { useState } from 'react';

// ============================================================================
// 1. PORT INSPECTOR
// ============================================================================
interface PortInfo {
  port: number;
  service: string;
  protocol: string;
  description: string;
  badgeColor: string;
}

const PORTS: PortInfo[] = [
  { port: 80, service: 'HTTP Web Server (Nginx / Apache)', protocol: 'TCP', description: 'Standard unencrypted web traffic. Browsers speak plaintext HTTP here.', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { port: 443, service: 'HTTPS Secure Web Server', protocol: 'TCP', description: 'Encrypted web traffic running over TLS. Modern browsers require this.', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { port: 22, service: 'SSH (Secure Shell Daemon)', protocol: 'TCP', description: 'Encrypted remote administration terminal access to manage the host.', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { port: 3306, service: 'MySQL Database Engine', protocol: 'TCP', description: 'Relational database query engine. Usually restricted to internal LAN.', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { port: 5432, service: 'PostgreSQL Database Engine', protocol: 'TCP', description: 'Enterprise relational database. Kept strictly behind firewalls.', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { port: 53, service: 'DNS (Domain Name System)', protocol: 'UDP / TCP', description: 'Translates human domain names to IP addresses. Fast 8-byte UDP datagrams.', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' }
];

export function PortInspector() {
  const [activePort, setActivePort] = useState<PortInfo>(PORTS[0]);
  const [pulse, setPulse] = useState(false);

  const selectPort = (p: PortInfo) => {
    setActivePort(p);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  };

  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-fd-border pb-3">
        <div>
          <h4 className="font-semibold text-fd-foreground">Interactive Port Inspector</h4>
          <p className="text-xs text-fd-muted-foreground">Click a port number to dispatch a packet and watch the OS route it to the listening socket process</p>
        </div>
        <span className="rounded-md border border-fd-border bg-fd-muted px-2 py-0.5 font-mono text-xs text-fd-muted-foreground">Layer 4 Demultiplexing</span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {PORTS.map((p) => (
          <button
            key={p.port}
            onClick={() => selectPort(p)}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activePort.port === p.port
                ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground shadow-sm'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/50'
            }`}
          >
            :{p.port} ({p.service.split(' ')[0]})
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Packet Visualization */}
        <div className="flex flex-col justify-between rounded-lg border border-fd-border bg-fd-background p-4 font-mono text-xs">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">Inbound Packet Header</div>
            <div className="space-y-1.5">
              <div className="flex justify-between border-b border-fd-border/50 py-1">
                <span className="text-fd-muted-foreground">Source IP:Port</span>
                <span className="text-fd-foreground">198.51.100.24:51240</span>
              </div>
              <div className="flex justify-between border-b border-fd-border/50 py-1">
                <span className="text-fd-muted-foreground">Destination IP</span>
                <span className="text-fd-foreground">203.0.113.10</span>
              </div>
              <div className="flex justify-between border-b border-fd-border/50 py-1">
                <span className="text-fd-muted-foreground">Destination Port</span>
                <span className={`font-bold transition-transform ${pulse ? 'scale-110 text-fd-primary' : 'text-fd-foreground'}`}>
                  :{activePort.port}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-fd-muted-foreground">Transport Protocol</span>
                <span className="text-fd-foreground">{activePort.protocol}</span>
              </div>
            </div>
          </div>
          <div className={`mt-3 rounded border p-2 text-center text-xs transition-all ${activePort.badgeColor}`}>
            Kernel Socket Table: Matched listener PID ➜ {activePort.service}
          </div>
        </div>

        {/* Operating System Routing Description */}
        <div className="rounded-lg border border-fd-border bg-fd-background p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">Operating System Action</div>
          <h5 className="mb-1 font-semibold text-fd-foreground">{activePort.service}</h5>
          <p className="text-xs leading-relaxed text-fd-muted-foreground">{activePort.description}</p>
          <div className="mt-3 rounded bg-fd-muted p-2 font-mono text-[11px] text-fd-foreground">
            <code>$ ss -tulpn | grep :{activePort.port}</code>
            <div className="mt-1 text-emerald-500">LISTEN 0 128 0.0.0.0:{activePort.port} (users:(&quot;{activePort.service.split(' ')[0].toLowerCase()}&quot;))</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. CIDR & SUBNET CALCULATOR
// ============================================================================
export function CidrCalculator() {
  const [prefix, setPrefix] = useState<number>(24);

  const hostBits = 32 - prefix;
  const totalIps = Math.pow(2, hostBits);
  const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, totalIps - 2);

  // Compute dotted-decimal mask
  const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const m1 = (maskInt >>> 24) & 255;
  const m2 = (maskInt >>> 16) & 255;
  const m3 = (maskInt >>> 8) & 255;
  const m4 = maskInt & 255;
  const subnetMask = `${m1}.${m2}.${m3}.${m4}`;

  // Binary representation string
  const binaryMask = Array.from({ length: 32 }, (_, i) => (i < prefix ? '1' : '0')).reduce(
    (acc, bit, i) => acc + bit + (i % 8 === 7 && i !== 31 ? '.' : ''),
    ''
  );

  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-fd-border pb-3">
        <div>
          <h4 className="font-semibold text-fd-foreground">Interactive CIDR & Subnet Calculator</h4>
          <p className="text-xs text-fd-muted-foreground">Drag the slider to alter the network prefix length and watch the host bits and mask recompute</p>
        </div>
        <span className="rounded-md border border-fd-border bg-fd-muted px-2 py-0.5 font-mono text-xs font-bold text-fd-primary">/{prefix}</span>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between font-mono text-xs">
          <span>Prefix: <b className="text-fd-primary">/{prefix}</b></span>
          <span className="text-fd-muted-foreground">Range: /8 (Large) to /30 (Point-to-Point)</span>
        </div>
        <input
          type="range"
          min="8"
          max="30"
          value={prefix}
          onChange={(e) => setPrefix(parseInt(e.target.value, 10))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-fd-muted accent-fd-primary"
        />
        <div className="mt-2 flex justify-between font-mono text-[10px] text-fd-muted-foreground">
          <span>/8 (Class A)</span>
          <span>/16 (Class B / Cloud VPC)</span>
          <span>/24 (Class C / Office LAN)</span>
          <span>/30 (P2P WAN)</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-fd-border bg-fd-background p-3 text-center">
          <div className="text-[11px] font-semibold uppercase text-fd-muted-foreground">Subnet Mask</div>
          <div className="mt-1 font-mono text-sm font-bold text-fd-foreground">{subnetMask}</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-background p-3 text-center">
          <div className="text-[11px] font-semibold uppercase text-fd-muted-foreground">Host Bits (H)</div>
          <div className="mt-1 font-mono text-sm font-bold text-cyan-400">{hostBits} bits (32 - {prefix})</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-background p-3 text-center">
          <div className="text-[11px] font-semibold uppercase text-fd-muted-foreground">Total Addresses</div>
          <div className="mt-1 font-mono text-sm font-bold text-amber-400">2^{hostBits} = {totalIps.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-background p-3 text-center">
          <div className="text-[11px] font-semibold uppercase text-fd-muted-foreground">Usable Hosts (2^H - 2)</div>
          <div className="mt-1 font-mono text-sm font-bold text-emerald-400">{usableHosts.toLocaleString()}</div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-fd-border bg-fd-muted/30 p-3 font-mono text-xs">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-fd-muted-foreground">Binary Mask Representation</div>
        <div className="mt-1 break-all text-xs tracking-wider">
          <span className="font-bold text-fd-primary">{binaryMask.slice(0, prefix + Math.floor(prefix / 8))}</span>
          <span className="text-fd-muted-foreground">{binaryMask.slice(prefix + Math.floor(prefix / 8))}</span>
        </div>
        <div className="mt-2 text-[11px] text-fd-muted-foreground">
          Blue bits = Network ID bits ({prefix}). Gray bits = Host address space ({hostBits}).
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. FIREWALL SIMULATOR (STATEFUL VS STATELESS)
// ============================================================================
export function FirewallSimulator() {
  const [port80, setPort80] = useState(true);
  const [port22, setPort22] = useState(false);
  const [port5432, setPort5432] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const testPacket = (port: number, name: string) => {
    let allowed = false;
    if (port === 80 && port80) allowed = true;
    if (port === 22 && port22) allowed = true;
    if (port === 5432 && port5432) allowed = true;

    if (allowed) {
      setTestResult(`ALLOWED: Inbound packet to port :${port} (${name}) matched PERMIT rule. Forwarded to service.`);
    } else {
      setTestResult(`BLOCKED: Inbound packet to port :${port} (${name}) dropped by default DENY rule. No connection.`);
    }
  };

  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-fd-border pb-3">
        <div>
          <h4 className="font-semibold text-fd-foreground">Stateful Firewall Engine</h4>
          <p className="text-xs text-fd-muted-foreground">Configure access rules and inject test packets to observe firewall filtering decisions</p>
        </div>
        <span className="rounded-md border border-fd-border bg-fd-muted px-2 py-0.5 font-mono text-xs text-fd-muted-foreground">Netfilter / Security Groups</span>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        {/* Rules Config */}
        <div className="rounded-lg border border-fd-border bg-fd-background p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">Active Inbound Security Rules</div>
          <div className="space-y-2 text-xs">
            <label className="flex cursor-pointer items-center justify-between rounded border border-fd-border p-2 hover:bg-fd-muted/30">
              <span>Port 80 / 443 (HTTP/HTTPS Web)</span>
              <input type="checkbox" checked={port80} onChange={(e) => setPort80(e.target.checked)} className="h-4 w-4 accent-fd-primary" />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded border border-fd-border p-2 hover:bg-fd-muted/30">
              <span>Port 22 (SSH Admin)</span>
              <input type="checkbox" checked={port22} onChange={(e) => setPort22(e.target.checked)} className="h-4 w-4 accent-fd-primary" />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded border border-fd-border p-2 hover:bg-fd-muted/30">
              <span>Port 5432 (PostgreSQL Database)</span>
              <input type="checkbox" checked={port5432} onChange={(e) => setPort5432(e.target.checked)} className="h-4 w-4 accent-fd-primary" />
            </label>
          </div>
          <div className="mt-2 text-[11px] text-fd-muted-foreground">*Default policy: DROP all unmatched unsolicited ingress packets.</div>
        </div>

        {/* Packet Injection Tester */}
        <div className="flex flex-col justify-between rounded-lg border border-fd-border bg-fd-background p-4">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">Test External Ingress Traffic</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => testPacket(80, 'Web Traffic')}
                className="rounded border border-fd-border bg-fd-card px-2.5 py-1 text-xs hover:border-fd-primary"
              >
                Send HTTP :80
              </button>
              <button
                onClick={() => testPacket(22, 'SSH Connection')}
                className="rounded border border-fd-border bg-fd-card px-2.5 py-1 text-xs hover:border-fd-primary"
              >
                Send SSH :22
              </button>
              <button
                onClick={() => testPacket(5432, 'DB Query')}
                className="rounded border border-fd-border bg-fd-card px-2.5 py-1 text-xs hover:border-fd-primary"
              >
                Send DB :5432
              </button>
              <button
                onClick={() => testPacket(3389, 'RDP Attack')}
                className="rounded border border-fd-border bg-fd-card px-2.5 py-1 text-xs hover:border-fd-primary"
              >
                Send RDP :3389
              </button>
            </div>
          </div>

          <div className="mt-3 rounded border border-fd-border bg-fd-muted/50 p-2.5 font-mono text-xs">
            <div className="text-[10px] uppercase text-fd-muted-foreground">Inspection Verdict:</div>
            <div className={testResult?.startsWith('ALLOWED') ? 'text-emerald-400' : 'text-rose-400'}>
              {testResult || 'Click a packet button above to test firewall evaluation...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. NAT / PAT TRANSLATOR SIMULATOR
// ============================================================================
export function NatTranslator() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '1. Internal Host Generates Outbound Request',
      detail: 'Private client 10.0.1.5 wants to load google.com (142.250.190.46:443). It creates a packet with Source: 10.0.1.5:49152 and Dest: 142.250.190.46:443.',
      src: '10.0.1.5:49152',
      dst: '142.250.190.46:443',
      table: 'Pending translation...'
    },
    {
      title: '2. NAT Gateway Rewrites Source Address (SNAT)',
      detail: 'The router replaces the private IP 10.0.1.5:49152 with its own public IP 203.0.113.10 and allocates mapped port :41001. It logs this translation in its state table.',
      src: '203.0.113.10:41001 (Translated)',
      dst: '142.250.190.46:443',
      table: 'TCP | 10.0.1.5:49152 ➜ 203.0.113.10:41001 ➜ 142.250.190.46:443'
    },
    {
      title: '3. Internet Server Replies to Public Address',
      detail: 'Google replies to 203.0.113.10:41001. The internet has no idea 10.0.1.5 exists.',
      src: '142.250.190.46:443',
      dst: '203.0.113.10:41001',
      table: 'Active flow session mapped'
    },
    {
      title: '4. NAT Gateway Rewrites Destination & Forwards (DNAT)',
      detail: 'The router checks its translation table, sees :41001 belongs to 10.0.1.5:49152, rewrites Dest to 10.0.1.5:49152, and forwards packet to the private host.',
      src: '142.250.190.46:443',
      dst: '10.0.1.5:49152 (Delivered)',
      table: 'Session completed successfully'
    }
  ];

  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-fd-border pb-3">
        <div>
          <h4 className="font-semibold text-fd-foreground">NAT / PAT Translation Stepper</h4>
          <p className="text-xs text-fd-muted-foreground">Follow a packet as it crosses a NAT gateway and witnesses IP address & port rewriting</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep((s) => (s > 0 ? s - 1 : 0))}
            disabled={step === 0}
            className="rounded border border-fd-border bg-fd-card px-2.5 py-1 text-xs disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setStep((s) => (s < 3 ? s + 1 : 0))}
            className="rounded border border-fd-primary bg-fd-primary px-2.5 py-1 text-xs font-semibold text-fd-primary-foreground"
          >
            {step === 3 ? 'Restart Flow' : 'Next Step ➔'}
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-fd-border bg-fd-background p-4">
        <h5 className="font-semibold text-fd-primary">{steps[step].title}</h5>
        <p className="mt-1 text-xs text-fd-muted-foreground">{steps[step].detail}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 font-mono text-xs">
        <div className="rounded-lg border border-fd-border bg-fd-background p-3">
          <div className="text-[10px] uppercase text-fd-muted-foreground">Packet Source IP:Port</div>
          <div className="mt-1 font-semibold text-emerald-400">{steps[step].src}</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-background p-3">
          <div className="text-[10px] uppercase text-fd-muted-foreground">Packet Destination IP:Port</div>
          <div className="mt-1 font-semibold text-cyan-400">{steps[step].dst}</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-background p-3">
          <div className="text-[10px] uppercase text-fd-muted-foreground">NAT Table Mapping</div>
          <div className="mt-1 text-[11px] text-amber-400">{steps[step].table}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. KUBERNETES POD & SERVICE LOAD BALANCER SIMULATOR
// ============================================================================
interface PodItem {
  id: string;
  ip: string;
  alive: boolean;
}

export function K8sServiceSimulator() {
  const [pods, setPods] = useState<PodItem[]>([
    { id: 'web-pod-a1b2', ip: '10.244.1.14', alive: true },
    { id: 'web-pod-c3d4', ip: '10.244.2.22', alive: true },
    { id: 'web-pod-e5f6', ip: '10.244.3.45', alive: true }
  ]);
  const [activePodId, setActivePodId] = useState<string | null>(null);
  const [reqLog, setReqLog] = useState<string>('Click "Send Service Request" to dispatch traffic...');

  const togglePod = (id: string) => {
    setPods((prev) =>
      prev.map((p) => (p.id === id ? { ...p, alive: !p.alive } : p))
    );
  };

  const sendRequest = () => {
    const alivePods = pods.filter((p) => p.alive);
    if (alivePods.length === 0) {
      setActivePodId(null);
      setReqLog('HTTP 503 Service Unavailable: No healthy pods remaining in Service Endpoints!');
      return;
    }
    const chosen = alivePods[Math.floor(Math.random() * alivePods.length)];
    setActivePodId(chosen.id);
    setReqLog(`kube-proxy routed ClusterIP 10.96.0.100:80 ➔ Pod ${chosen.id} (${chosen.ip}:8080)`);
  };

  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-fd-border pb-3">
        <div>
          <h4 className="font-semibold text-fd-foreground">Kubernetes Service & Pod Churn Simulator</h4>
          <p className="text-xs text-fd-muted-foreground">Click a pod to kill or resurrect it. Send traffic to the stable Service IP to watch dynamic load balancing.</p>
        </div>
        <span className="rounded-md border border-fd-border bg-fd-muted px-2 py-0.5 font-mono text-xs font-semibold text-fd-primary">ClusterIP: 10.96.0.100</span>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {pods.map((p) => (
          <div
            key={p.id}
            onClick={() => togglePod(p.id)}
            className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
              !p.alive
                ? 'border-dashed border-rose-500/40 bg-rose-500/5 opacity-50'
                : activePodId === p.id
                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                : 'border-fd-border bg-fd-background hover:border-fd-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-fd-foreground">{p.id}</span>
              <span className={`text-[10px] font-semibold uppercase ${p.alive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {p.alive ? 'Running' : 'Dead (Killed)'}
              </span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-fd-muted-foreground">Pod IP: {p.ip}</div>
            <div className="mt-2 text-[10px] text-fd-muted-foreground/80">(Click to toggle status)</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-fd-border bg-fd-background p-3">
        <button
          onClick={sendRequest}
          className="rounded-lg border border-fd-primary bg-fd-primary px-3 py-1.5 font-mono text-xs font-semibold text-fd-primary-foreground transition-all hover:bg-fd-primary/90"
        >
          Send Service Request ➔
        </button>
        <div className="font-mono text-xs text-fd-muted-foreground">
          {reqLog}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. PACKET JOURNEY FLOW STEPPER
// ============================================================================
export function PacketJourneyFlow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { layer: 'Browser / OS', title: '1. User Types URL & DNS Resolves', desc: 'User requests https://shopeasy.com. Browser checks cache, queries recursive DNS resolver, receives IP 203.0.113.10.' },
    { layer: 'Transport (L4)', title: '2. TCP 3-Way Handshake Established', desc: 'Client sends SYN to 203.0.113.10:443. Server returns SYN-ACK. Client replies with ACK. Connection is ESTABLISHED.' },
    { layer: 'Security (TLS)', title: '3. TLS 1.3 Cryptographic Key Exchange', desc: 'ClientHello & ServerHello exchange ECDHE public keys. Shared symmetric AES-256 session key generated in 1 round trip.' },
    { layer: 'Internet Core', title: '4. BGP Routing & Submarine Fiber Transit', desc: 'Packets traverse transit autonomous systems across subsea fiber cables, decremented hop-by-hop by TTL.' },
    { layer: 'Cloud Edge', title: '5. VPC Internet Gateway & Firewall Ingress', desc: 'Packet hits Cloud IGW, stateful security group allows port 443, reverse proxy terminates TLS and proxies to cluster.' },
    { layer: 'Kubernetes Pod', title: '6. CNI Pod Delivery & HTTP 200 Response', desc: 'kube-proxy maps Service ClusterIP to active backend Pod. Process receives request, serves HTML, renders on client.' }
  ];

  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-fd-border pb-3">
        <div>
          <h4 className="font-semibold text-fd-foreground">The Complete Packet Journey (End-to-End)</h4>
          <p className="text-xs text-fd-muted-foreground">Step through the life of a web request from browser keystroke to cloud-native pod response</p>
        </div>
        <span className="rounded-md border border-fd-border bg-fd-muted px-2 py-0.5 font-mono text-xs text-fd-primary">Step {activeStep + 1} of {steps.length}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`rounded-md border px-2.5 py-1 text-xs font-mono transition-all ${
              activeStep === idx
                ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground font-semibold'
                : 'border-fd-border bg-fd-background text-fd-muted-foreground hover:border-fd-primary/50'
            }`}
          >
            {idx + 1}. {s.layer}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-fd-border bg-fd-background p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-fd-primary">{steps[activeStep].layer}</div>
        <h5 className="mt-1 font-semibold text-fd-foreground">{steps[activeStep].title}</h5>
        <p className="mt-1.5 text-xs leading-relaxed text-fd-muted-foreground">{steps[activeStep].desc}</p>
      </div>
    </div>
  );
}
