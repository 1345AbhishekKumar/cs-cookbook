'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Key,
  Server,
  Laptop,
  Database,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Check,
  AlertTriangle,
  Play,
  Sliders,
  Sparkles,
  Layers,
  Radio,
  FileCode2,
  Terminal,
  RefreshCw,
} from 'lucide-react';

// ============================================================================
// 1. REQUEST & RESPONSE LIFECYCLE SIMULATOR
// ============================================================================

type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface VerbData {
  verb: HttpVerb;
  desc: string;
  badgeClass: string;
  request: string;
  response: string;
  statusCode: string;
  statusType: 'ok' | 'created' | 'nocontent' | 'notfound';
}

const VERB_DETAILS: Record<HttpVerb, VerbData> = {
  GET: {
    verb: 'GET',
    desc: 'Retrieve resource state without side-effects',
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    request: `GET /api/users/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...
Accept: application/json`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=300

{
  "id": 42,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "Lead Architect"
}`,
    statusCode: '200 OK',
    statusType: 'ok',
  },
  POST: {
    verb: 'POST',
    desc: 'Create a new subordinate resource',
    badgeClass: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    request: `POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "name": "Grace Hopper",
  "email": "grace@example.com",
  "role": "Compiler Engineer"
}`,
    response: `HTTP/1.1 201 Created
Location: /api/users/43
Content-Type: application/json

{
  "id": 43,
  "name": "Grace Hopper",
  "email": "grace@example.com",
  "createdAt": "2026-10-05T14:30:00Z"
}`,
    statusCode: '201 Created',
    statusType: 'created',
  },
  PUT: {
    verb: 'PUT',
    desc: 'Completely replace the existing resource',
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    request: `PUT /api/users/42 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "name": "Ada Lovelace (Countess)",
  "email": "ada.lovelace@example.com",
  "role": "Chief Systems Theorist"
}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "name": "Ada Lovelace (Countess)",
  "email": "ada.lovelace@example.com",
  "role": "Chief Systems Theorist",
  "updatedAt": "2026-10-05T14:32:10Z"
}`,
    statusCode: '200 OK',
    statusType: 'ok',
  },
  PATCH: {
    verb: 'PATCH',
    desc: 'Apply partial delta modifications to resource',
    badgeClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    request: `PATCH /api/users/42 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "email": "ada.byron@computed.org"
}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "name": "Ada Lovelace (Countess)",
  "email": "ada.byron@computed.org",
  "role": "Chief Systems Theorist"
}`,
    statusCode: '200 OK',
    statusType: 'ok',
  },
  DELETE: {
    verb: 'DELETE',
    desc: 'Remove the identified resource permanently',
    badgeClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    request: `DELETE /api/users/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...`,
    response: `HTTP/1.1 204 No Content
Date: Mon, 05 Oct 2026 14:33:00 GMT

// Resource successfully purged from database.
// No response body returned per RFC 9110.`,
    statusCode: '204 No Content',
    statusType: 'nocontent',
  },
};

export function ApiRequestLifecycleDemo() {
  const [selectedVerb, setSelectedVerb] = useState<HttpVerb>('GET');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const data = VERB_DETAILS[selectedVerb];

  const runSimulation = (verb: HttpVerb) => {
    setSelectedVerb(verb);
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1); // Client sending

    setTimeout(() => setActiveStep(2), 500); // Traveling to API
    setTimeout(() => setActiveStep(3), 1100); // API authenticating & validating
    setTimeout(() => setActiveStep(4), 1600); // Traveling to Backend Server/DB
    setTimeout(() => setActiveStep(5), 2200); // Server processing
    setTimeout(() => setActiveStep(6), 2800); // Returning via API
    setTimeout(() => {
      setActiveStep(7); // Completed at Client
      setIsRunning(false);
    }, 3400);
  };

  useEffect(() => {
    runSimulation('GET');
  }, []);

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-fd-border pb-3">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-fd-foreground">
            <Radio className="h-4 w-4 text-cyan-400" />
            Interactive API Request & Response Lifecycle
          </h4>
          <p className="text-xs text-fd-muted-foreground">
            Select an HTTP method to trace how request packets travel from client, through the API gateway, into backend storage, and return.
          </p>
        </div>
        <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-400">
          RFC 9110 HTTP Pipeline
        </span>
      </div>

      {/* Method Buttons */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(Object.keys(VERB_DETAILS) as HttpVerb[]).map((v) => (
          <button
            key={v}
            onClick={() => runSimulation(v)}
            disabled={isRunning}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              selectedVerb === v
                ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground shadow-sm'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/50'
            } ${isRunning ? 'opacity-80' : ''}`}
          >
            <span>{v}</span>
            <span className="hidden sm:inline font-sans font-normal text-[11px] opacity-75">
              {v === 'GET' ? 'Read' : v === 'POST' ? 'Create' : v === 'PUT' ? 'Replace' : v === 'PATCH' ? 'Update' : 'Delete'}
            </span>
          </button>
        ))}
      </div>

      {/* Visual Animation Highway */}
      <div className="mb-6 rounded-lg border border-fd-border bg-fd-background p-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center">
          {/* Client Node */}
          <div
            className={`rounded-lg border p-3 transition-all ${
              activeStep === 1 || activeStep === 7
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                : 'border-fd-border bg-fd-muted/30'
            }`}
          >
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
              <Laptop className="h-4 w-4" />
            </div>
            <div className="font-mono text-xs font-bold text-fd-foreground">Client App</div>
            <div className="text-[10px] text-fd-muted-foreground">React / Mobile / cURL</div>
          </div>

          {/* API Gateway Node */}
          <div
            className={`rounded-lg border p-3 transition-all ${
              activeStep === 3 || activeStep === 6
                ? 'border-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(96,165,250,0.25)]'
                : 'border-fd-border bg-fd-muted/30'
            }`}
          >
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <Globe className="h-4 w-4" />
            </div>
            <div className="font-mono text-xs font-bold text-fd-foreground">API Gateway / Proxy</div>
            <div className="text-[10px] text-blue-400">Auth, Rate Limit, Validate</div>
          </div>

          {/* Backend Server / DB Node */}
          <div
            className={`rounded-lg border p-3 transition-all ${
              activeStep === 5
                ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'border-fd-border bg-fd-muted/30'
            }`}
          >
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
              <Server className="h-4 w-4" />
            </div>
            <div className="font-mono text-xs font-bold text-fd-foreground">Backend & Database</div>
            <div className="text-[10px] text-fd-muted-foreground">Postgres, Redis, Logic</div>
          </div>
        </div>

        {/* Dynamic Status Progress Tracker */}
        <div className="mt-4 flex items-center justify-between rounded-md border border-fd-border/70 bg-fd-muted/40 px-3 py-2 text-xs">
          <span className="font-mono text-fd-muted-foreground">Status Pipeline:</span>
          <span className="font-mono font-semibold text-cyan-400">
            {activeStep === 1 && `1. Client dispatches ${selectedVerb} request`}
            {activeStep === 2 && '2. Request traveling through network packets...'}
            {activeStep === 3 && '3. API Gateway verifying API Key & Rate Limits'}
            {activeStep === 4 && '4. Forwarding validated payload to backend service'}
            {activeStep === 5 && '5. Database executing SQL & business logic transaction'}
            {activeStep === 6 && `6. Server returning ${data.statusCode} packet to API`}
            {activeStep === 7 && `7. Complete! Client received ${data.statusCode}`}
          </span>
        </div>
      </div>

      {/* Code Inspector Panels */}
      <div className="grid gap-4 md:grid-cols-2 font-mono text-xs">
        {/* Request Panel */}
        <div className="rounded-lg border border-fd-border bg-fd-background p-3.5">
          <div className="mb-2 flex items-center justify-between border-b border-fd-border/50 pb-2">
            <span className="font-semibold text-fd-foreground">HTTP Request</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${data.badgeClass}`}>
              {selectedVerb}
            </span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-fd-foreground">
            {data.request}
          </pre>
        </div>

        {/* Response Panel */}
        <div className="rounded-lg border border-fd-border bg-fd-background p-3.5">
          <div className="mb-2 flex items-center justify-between border-b border-fd-border/50 pb-2">
            <span className="font-semibold text-fd-foreground">HTTP Response</span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                data.statusType === 'ok'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : data.statusType === 'created'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
              }`}
            >
              {data.statusCode}
            </span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
            {data.response}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. API TYPES & SCOPES EXPLORER
// ============================================================================

interface ApiScopeType {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  whoUses: string;
  description: string;
  useCase: string;
  examples: string[];
}

const API_TYPES: ApiScopeType[] = [
  {
    id: 'public',
    name: 'Open / Public APIs',
    badge: 'Universal Access',
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    whoUses: 'Any external developer or organization worldwide.',
    description:
      'Open APIs are publicly accessible with minimal or self-service registration. Designed to build developer ecosystems, encourage viral adoption, and drive external software integrations.',
    useCase: 'Public weather widgets, social sharing, public search data, currency rates.',
    examples: ['Twitter/X Public API', 'OpenWeatherMap API', 'GitHub REST API', 'Google Geocoding API'],
  },
  {
    id: 'partner',
    name: 'Partner APIs',
    badge: 'B2B Contractual',
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    whoUses: 'Specifically onboarded business partners under mutual SLA agreements.',
    description:
      'Not accessible to the general public. Access requires formal contracts, dedicated mutual authentication, enterprise API keys, or VPN peering to safeguard commercial workflows.',
    useCase: 'Payment gateway settlement, flight reservation systems, supply chain logistics.',
    examples: ['Stripe Connect', 'Paystack B2B API', 'Sabre Airline Booking API', 'FedEx Tracking Services'],
  },
  {
    id: 'internal',
    name: 'Internal / Private APIs',
    badge: 'Zero-Trust Intranet',
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    whoUses: 'Only in-house engineering teams and microservices inside the organization.',
    description:
      'Completely hidden behind firewalls, Kubernetes ingress controllers, or service meshes. Never exposed to external traffic, preventing exposure of proprietary databases and payroll systems.',
    useCase: 'HR microservice talking to payroll database, internal audit telemetry, order ingestion worker.',
    examples: ['Workday Internal Gateway', 'Microservice-to-Microservice mTLS', 'Core Banking Ledger'],
  },
  {
    id: 'composite',
    name: 'Composite APIs',
    badge: 'Multi-Call Aggregation',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    whoUses: 'Frontend applications requiring aggregate data from multiple microservices.',
    description:
      'Combines multiple backend API calls into a single unified client request. Eliminates network latency by reducing round-trips over cellular connections (e.g. mobile apps).',
    useCase: 'E-commerce product page: fetches product description + live inventory + customer reviews in 1 call.',
    examples: ['GraphQL Gateway Aggregator', 'BFF (Backend-For-Frontend) Pattern', 'Netflix Falcor Router'],
  },
];

export function ApiTypesExplorer() {
  const [activeType, setActiveType] = useState<ApiScopeType>(API_TYPES[0]);

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-fd-border pb-3">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-fd-foreground">
            <Layers className="h-4 w-4 text-purple-400" />
            Interactive API Types & Architectural Scopes
          </h4>
          <p className="text-xs text-fd-muted-foreground">
            Explore how APIs are categorized by access boundary, security tier, and target consumer.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {API_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveType(t)}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeType.id === t.id
                ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground shadow-sm'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/50'
            }`}
          >
            {t.name.split(' ')[0]} API
          </button>
        ))}
      </div>

      {/* Detail Card */}
      <div className="rounded-lg border border-fd-border bg-fd-background p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-fd-border/50 pb-2">
          <div className="flex items-center gap-2">
            <h5 className="font-semibold text-fd-foreground">{activeType.name}</h5>
            <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold ${activeType.badgeColor}`}>
              {activeType.badge}
            </span>
          </div>
          <span className="font-mono text-xs text-fd-muted-foreground">Who Uses: {activeType.whoUses}</span>
        </div>

        <p className="mb-4 text-xs leading-relaxed text-fd-muted-foreground">{activeType.description}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-fd-border/70 bg-fd-muted/30 p-2.5">
            <div className="mb-1 text-[11px] font-semibold text-fd-foreground">Primary Architecture Purpose</div>
            <div className="text-xs text-fd-muted-foreground">{activeType.useCase}</div>
          </div>
          <div className="rounded-md border border-fd-border/70 bg-fd-muted/30 p-2.5">
            <div className="mb-1 text-[11px] font-semibold text-fd-foreground">Industry Examples</div>
            <div className="flex flex-wrap gap-1.5">
              {activeType.examples.map((ex, i) => (
                <span
                  key={i}
                  className="rounded border border-fd-border bg-fd-card px-2 py-0.5 font-mono text-[10px] text-fd-foreground"
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. REST BOOK CATALOG IN-MEMORY CRUD PLAYGROUND
// ============================================================================

interface BookItem {
  id: number;
  title: string;
  author: string;
  year: number;
}

const INITIAL_BOOKS: BookItem[] = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Andy Hunt', year: 1999 },
  { id: 2, title: 'Clean Architecture', author: 'Robert C. Martin', year: 2017 },
  { id: 3, title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann', year: 2017 },
];

export function RestBookPlayground() {
  const [books, setBooks] = useState<BookItem[]>(INITIAL_BOOKS);
  const [selectedAction, setSelectedAction] = useState<string>('getall');
  const [responseLog, setResponseLog] = useState<{
    method: string;
    path: string;
    status: string;
    body: string;
    isError?: boolean;
  }>({
    method: 'GET',
    path: '/api/v1/books',
    status: '200 OK',
    body: JSON.stringify(INITIAL_BOOKS, null, 2),
  });

  const handleAction = (action: string) => {
    setSelectedAction(action);
    switch (action) {
      case 'getall':
        setResponseLog({
          method: 'GET',
          path: '/api/v1/books',
          status: '200 OK',
          body: JSON.stringify(books, null, 2),
        });
        break;
      case 'getone': {
        const found = books.find((b) => b.id === 1);
        if (found) {
          setResponseLog({
            method: 'GET',
            path: '/api/v1/books/1',
            status: '200 OK',
            body: JSON.stringify(found, null, 2),
          });
        } else {
          setResponseLog({
            method: 'GET',
            path: '/api/v1/books/1',
            status: '404 Not Found',
            body: JSON.stringify({ error: 'Book with ID 1 was not found in storage' }, null, 2),
            isError: true,
          });
        }
        break;
      }
      case 'getmissing':
        setResponseLog({
          method: 'GET',
          path: '/api/v1/books/999',
          status: '404 Not Found',
          body: JSON.stringify({ error: 'Book with ID 999 not found' }, null, 2),
          isError: true,
        });
        break;
      case 'post': {
        const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
        const newBook: BookItem = {
          id: newId,
          title: 'Refactoring (2nd Edition)',
          author: 'Martin Fowler',
          year: 2018,
        };
        const updated = [...books, newBook];
        setBooks(updated);
        setResponseLog({
          method: 'POST',
          path: '/api/v1/books',
          status: '201 Created',
          body: JSON.stringify(newBook, null, 2),
        });
        break;
      }
      case 'put': {
        const updated = books.map((b) =>
          b.id === 1 ? { id: 1, title: 'The Pragmatic Programmer (20th Anniversary)', author: 'David Thomas & Andrew Hunt', year: 2019 } : b
        );
        setBooks(updated);
        const replaced = updated.find((b) => b.id === 1);
        setResponseLog({
          method: 'PUT',
          path: '/api/v1/books/1',
          status: '200 OK',
          body: JSON.stringify(replaced, null, 2),
        });
        break;
      }
      case 'patch': {
        const updated = books.map((b) =>
          b.id === 1 ? { ...b, title: 'Pragmatic Programmer (Patched Edition)' } : b
        );
        setBooks(updated);
        const patched = updated.find((b) => b.id === 1);
        setResponseLog({
          method: 'PATCH',
          path: '/api/v1/books/1',
          status: '200 OK',
          body: JSON.stringify(patched, null, 2),
        });
        break;
      }
      case 'delete': {
        const remaining = books.filter((b) => b.id !== 2);
        setBooks(remaining);
        setResponseLog({
          method: 'DELETE',
          path: '/api/v1/books/2',
          status: '204 No Content',
          body: '// Book 2 deleted from memory. Status 204 has zero response body.',
        });
        break;
      }
      case 'reset': {
        setBooks(INITIAL_BOOKS);
        setResponseLog({
          method: 'GET',
          path: '/api/v1/books',
          status: '200 OK',
          body: JSON.stringify(INITIAL_BOOKS, null, 2),
        });
        break;
      }
    }
  };

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-fd-border pb-3">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-fd-foreground">
            <Terminal className="h-4 w-4 text-emerald-400" />
            Live In-Memory REST CRUD Playground
          </h4>
          <p className="text-xs text-fd-muted-foreground">
            Execute real HTTP requests against an in-memory database right in your browser. Watch how mutations alter collection state.
          </p>
        </div>
        <button
          onClick={() => handleAction('reset')}
          className="flex items-center gap-1.5 rounded border border-fd-border bg-fd-card px-2.5 py-1 text-xs text-fd-muted-foreground hover:text-fd-foreground"
        >
          <RefreshCw className="h-3 w-3" />
          Reset DB
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Actions List */}
        <div className="space-y-1.5 lg:col-span-5 font-mono text-xs">
          <button
            onClick={() => handleAction('getall')}
            className={`w-full flex items-center justify-between rounded-lg border p-2 text-left transition-all ${
              selectedAction === 'getall'
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/40'
            }`}
          >
            <span className="font-bold text-emerald-400">GET /books</span>
            <span className="text-[10px] text-fd-muted-foreground font-sans">List all</span>
          </button>
          <button
            onClick={() => handleAction('getone')}
            className={`w-full flex items-center justify-between rounded-lg border p-2 text-left transition-all ${
              selectedAction === 'getone'
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/40'
            }`}
          >
            <span className="font-bold text-emerald-400">GET /books/1</span>
            <span className="text-[10px] text-fd-muted-foreground font-sans">Single entity</span>
          </button>
          <button
            onClick={() => handleAction('getmissing')}
            className={`w-full flex items-center justify-between rounded-lg border p-2 text-left transition-all ${
              selectedAction === 'getmissing'
                ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/40'
            }`}
          >
            <span className="font-bold text-rose-400">GET /books/999</span>
            <span className="text-[10px] text-fd-muted-foreground font-sans">404 Error</span>
          </button>
          <button
            onClick={() => handleAction('post')}
            className={`w-full flex items-center justify-between rounded-lg border p-2 text-left transition-all ${
              selectedAction === 'post'
                ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/40'
            }`}
          >
            <span className="font-bold text-blue-400">POST /books</span>
            <span className="text-[10px] text-fd-muted-foreground font-sans">Append item</span>
          </button>
          <button
            onClick={() => handleAction('put')}
            className={`w-full flex items-center justify-between rounded-lg border p-2 text-left transition-all ${
              selectedAction === 'put'
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/40'
            }`}
          >
            <span className="font-bold text-amber-400">PUT /books/1</span>
            <span className="text-[10px] text-fd-muted-foreground font-sans">Replace item</span>
          </button>
          <button
            onClick={() => handleAction('patch')}
            className={`w-full flex items-center justify-between rounded-lg border p-2 text-left transition-all ${
              selectedAction === 'patch'
                ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/40'
            }`}
          >
            <span className="font-bold text-purple-400">PATCH /books/1</span>
            <span className="text-[10px] text-fd-muted-foreground font-sans">Partial update</span>
          </button>
          <button
            onClick={() => handleAction('delete')}
            className={`w-full flex items-center justify-between rounded-lg border p-2 text-left transition-all ${
              selectedAction === 'delete'
                ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                : 'border-fd-border bg-fd-card text-fd-foreground hover:border-fd-primary/40'
            }`}
          >
            <span className="font-bold text-rose-400">DELETE /books/2</span>
            <span className="text-[10px] text-fd-muted-foreground font-sans">Purge item</span>
          </button>
        </div>

        {/* Live Response & DB Preview */}
        <div className="space-y-3 lg:col-span-7">
          {/* Response Console */}
          <div className="rounded-lg border border-fd-border bg-fd-background p-3">
            <div className="mb-2 flex items-center justify-between border-b border-fd-border/50 pb-1.5 font-mono text-xs">
              <span className="font-bold text-fd-foreground">
                {responseLog.method} {responseLog.path}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                  responseLog.isError
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {responseLog.status}
              </span>
            </div>
            <pre className="max-h-40 overflow-y-auto font-mono text-[11px] leading-relaxed text-fd-muted-foreground">
              {responseLog.body}
            </pre>
          </div>

          {/* Current State of DB */}
          <div className="rounded-lg border border-fd-border bg-fd-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-mono font-semibold uppercase text-fd-muted-foreground">Current Database Table ({books.length} records)</span>
              <Database className="h-3.5 w-3.5 text-fd-muted-foreground" />
            </div>
            <div className="space-y-1">
              {books.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded border border-fd-border/50 bg-fd-card px-2 py-1 font-mono text-[11px]"
                >
                  <span className="text-cyan-400">#{b.id} {b.title}</span>
                  <span className="text-fd-muted-foreground">{b.author} ({b.year})</span>
                </div>
              ))}
              {books.length === 0 && (
                <div className="py-2 text-center font-mono text-xs text-rose-400">Database table is completely empty.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. GRAPHQL OVER-FETCHING VS UNDER-FETCHING SIMULATOR
// ============================================================================

const PRODUCT_DATA = {
  id: 'prod_902',
  name: 'Studio Wireless Pro Headphones',
  price: 249.99,
  description: 'Audiophile active noise cancelling with 40-hour lossless playback.',
  inventory: 38,
  category: 'Hardware / Audio',
  dimensions: '180 x 170 x 80 mm',
  weightGrams: 260,
};

export function GraphqlOverfetchingDemo() {
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'price']);

  const toggleField = (f: string) => {
    if (selectedFields.includes(f)) {
      setSelectedFields(selectedFields.filter((item) => item !== f));
    } else {
      setSelectedFields([...selectedFields, f]);
    }
  };

  const dynamicGqlResponse: Record<string, any> = {};
  selectedFields.forEach((field) => {
    dynamicGqlResponse[field] = (PRODUCT_DATA as any)[field];
  });

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-fd-border pb-3">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-fd-foreground">
            <Sparkles className="h-4 w-4 text-pink-400" />
            Interactive GraphQL: Preventing Over-Fetching & Under-Fetching
          </h4>
          <p className="text-xs text-fd-muted-foreground">
            Toggle product fields below. Watch how GraphQL delivers precisely what the client requested, while REST delivers all 8 fixed fields every time.
          </p>
        </div>
        <span className="rounded-md border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 font-mono text-xs text-pink-400">
          Client-Driven Query Shape
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Field Checkboxes */}
        <div className="rounded-lg border border-fd-border bg-fd-background p-4 lg:col-span-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Select Requested Fields
          </div>
          <div className="space-y-2">
            {Object.keys(PRODUCT_DATA).map((key) => {
              const isChecked = selectedFields.includes(key);
              return (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between rounded border border-fd-border/60 bg-fd-card/50 px-2.5 py-1.5 transition-colors hover:bg-fd-muted"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleField(key)}
                      className="rounded border-fd-border accent-pink-500"
                    />
                    <span className="font-mono text-xs text-fd-foreground">{key}</span>
                  </div>
                  <span className="font-mono text-[10px] text-fd-muted-foreground">
                    {typeof (PRODUCT_DATA as any)[key]}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="mt-4 rounded bg-fd-muted/40 p-2 text-center font-mono text-[11px] text-fd-muted-foreground">
            {selectedFields.length} of {Object.keys(PRODUCT_DATA).length} fields requested
          </div>
        </div>

        {/* Query & Side-by-side Response */}
        <div className="grid gap-3 lg:col-span-8 md:grid-cols-2">
          {/* GraphQL Response */}
          <div className="rounded-lg border border-pink-500/30 bg-fd-background p-3.5">
            <div className="mb-2 flex items-center justify-between border-b border-fd-border pb-2">
              <span className="font-mono text-xs font-bold text-pink-400">GraphQL Dynamic Payload</span>
              <span className="rounded bg-pink-500/10 px-2 py-0.5 font-mono text-[10px] text-pink-400">
                {selectedFields.length} fields transferred
              </span>
            </div>
            <pre className="max-h-60 overflow-y-auto font-mono text-[11px] leading-relaxed text-fd-foreground">
              {JSON.stringify({ data: { product: dynamicGqlResponse } }, null, 2)}
            </pre>
          </div>

          {/* Fixed REST Response */}
          <div className="rounded-lg border border-fd-border bg-fd-background p-3.5 opacity-85">
            <div className="mb-2 flex items-center justify-between border-b border-fd-border pb-2">
              <span className="font-mono text-xs font-bold text-fd-muted-foreground">REST: GET /products/902</span>
              <span className="rounded border border-fd-border bg-fd-muted px-2 py-0.5 font-mono text-[10px] text-fd-muted-foreground">
                Always 8 fields
              </span>
            </div>
            <pre className="max-h-60 overflow-y-auto font-mono text-[11px] leading-relaxed text-fd-muted-foreground">
              {JSON.stringify(PRODUCT_DATA, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. gRPC STREAMING PATTERNS SIMULATOR WITH ANIMATED SVG
// ============================================================================

type GrpcMode = 'unary' | 'server' | 'client' | 'bidi';

export function GrpcStreamingDemo() {
  const [mode, setMode] = useState<GrpcMode>('unary');

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-fd-border pb-3">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-fd-foreground">
            <Radio className="h-4 w-4 text-cyan-400" />
            Interactive gRPC & HTTP/2 Streaming Patterns
          </h4>
          <p className="text-xs text-fd-muted-foreground">
            gRPC leverages HTTP/2 multiplexed streams and binary Protocol Buffers. Select a mode to view real-time data frame transmission.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setMode('unary')}
          className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
            mode === 'unary'
              ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400'
              : 'border-fd-border bg-fd-card text-fd-foreground hover:border-cyan-400/50'
          }`}
        >
          1. Unary (1:1)
        </button>
        <button
          onClick={() => setMode('server')}
          className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
            mode === 'server'
              ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400'
              : 'border-fd-border bg-fd-card text-fd-foreground hover:border-cyan-400/50'
          }`}
        >
          2. Server Streaming (1:N)
        </button>
        <button
          onClick={() => setMode('client')}
          className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
            mode === 'client'
              ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400'
              : 'border-fd-border bg-fd-card text-fd-foreground hover:border-cyan-400/50'
          }`}
        >
          3. Client Streaming (N:1)
        </button>
        <button
          onClick={() => setMode('bidi')}
          className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
            mode === 'bidi'
              ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400'
              : 'border-fd-border bg-fd-card text-fd-foreground hover:border-cyan-400/50'
          }`}
        >
          4. Bidirectional (N:N)
        </button>
      </div>

      {/* Animated SVG Stream */}
      <div className="rounded-lg border border-fd-border bg-fd-background p-4">
        <svg viewBox="0 0 680 200" className="w-full h-auto" role="img" aria-label="gRPC stream diagram">
          {/* Nodes */}
          <rect x="30" y="70" width="110" height="60" rx="8" fill="#0c1524" stroke="#1a2942" strokeWidth="1.5" />
          <text x="85" y="98" fill="#e8eef8" fontFamily="monospace" fontSize="12" textAnchor="middle" fontWeight="bold">Client</text>
          <text x="85" y="115" fill="#66799a" fontFamily="monospace" fontSize="9" textAnchor="middle">Stub (Protobuf)</text>

          <rect x="540" y="70" width="110" height="60" rx="8" fill="#0c1524" stroke="#1a2942" strokeWidth="1.5" />
          <text x="595" y="98" fill="#e8eef8" fontFamily="monospace" fontSize="12" textAnchor="middle" fontWeight="bold">Server</text>
          <text x="595" y="115" fill="#66799a" fontFamily="monospace" fontSize="9" textAnchor="middle">HTTP/2 Engine</text>

          {/* Unary */}
          {mode === 'unary' && (
            <>
              <line x1="140" y1="85" x2="540" y2="85" stroke="#38bdf8" strokeWidth="2" />
              <line x1="540" y1="115" x2="140" y2="115" stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" />
              <circle r="5" fill="#38bdf8">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M140,85 L540,85" />
              </circle>
              <circle r="5" fill="#4ade80">
                <animateMotion dur="1.8s" begin="0.9s" repeatCount="indefinite" path="M540,115 L140,115" />
              </circle>
              <text x="340" y="75" fill="#38bdf8" fontFamily="monospace" fontSize="10" textAnchor="middle">1 Request Frame →</text>
              <text x="340" y="135" fill="#4ade80" fontFamily="monospace" fontSize="10" textAnchor="middle">← 1 Response Frame</text>
            </>
          )}

          {/* Server Streaming */}
          {mode === 'server' && (
            <>
              <line x1="140" y1="70" x2="540" y2="70" stroke="#38bdf8" strokeWidth="2" />
              <circle r="5" fill="#38bdf8">
                <animateMotion dur="2s" repeatCount="indefinite" path="M140,70 L540,70" />
              </circle>
              <text x="340" y="60" fill="#38bdf8" fontFamily="monospace" fontSize="10" textAnchor="middle">1 Initial Request →</text>

              {[95, 115, 135].map((y, idx) => (
                <React.Fragment key={idx}>
                  <line x1="540" y1={y} x2="140" y2={y} stroke="#4ade80" strokeWidth="1.5" strokeDasharray="5 5" />
                  <circle r="4" fill="#4ade80">
                    <animateMotion dur="2.4s" begin={`${idx * 0.4}s`} repeatCount="indefinite" path={`M540,${y} L140,${y}`} />
                  </circle>
                </React.Fragment>
              ))}
              <text x="340" y="160" fill="#4ade80" fontFamily="monospace" fontSize="10" textAnchor="middle">← Server Pushes Continuous Stream of Chunks</text>
            </>
          )}

          {/* Client Streaming */}
          {mode === 'client' && (
            <>
              {[70, 90, 110].map((y, idx) => (
                <React.Fragment key={idx}>
                  <line x1="140" y1={y} x2="540" y2={y} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 5" />
                  <circle r="4" fill="#38bdf8">
                    <animateMotion dur="2.4s" begin={`${idx * 0.4}s`} repeatCount="indefinite" path={`M140,${y} L540,${y}`} />
                  </circle>
                </React.Fragment>
              ))}
              <text x="340" y="55" fill="#38bdf8" fontFamily="monospace" fontSize="10" textAnchor="middle">Client Streams File / Sensor Packets →</text>

              <line x1="540" y1="135" x2="140" y2="135" stroke="#4ade80" strokeWidth="2" />
              <circle r="5" fill="#4ade80">
                <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M540,135 L140,135" />
              </circle>
              <text x="340" y="155" fill="#4ade80" fontFamily="monospace" fontSize="10" textAnchor="middle">← 1 Final Acknowledgment Summary</text>
            </>
          )}

          {/* Bidirectional */}
          {mode === 'bidi' && (
            <>
              <line x1="140" y1="80" x2="540" y2="80" stroke="#38bdf8" strokeWidth="2" />
              <line x1="540" y1="120" x2="140" y2="120" stroke="#4ade80" strokeWidth="2" />
              <circle r="5" fill="#38bdf8">
                <animateMotion dur="1.5s" repeatCount="indefinite" path="M140,80 L540,80" />
              </circle>
              <circle r="5" fill="#4ade80">
                <animateMotion dur="1.5s" begin="0.75s" repeatCount="indefinite" path="M540,120 L140,120" />
              </circle>
              <text x="340" y="65" fill="#38bdf8" fontFamily="monospace" fontSize="10" textAnchor="middle">Outbound Stream Frames (Multiplexed) →</text>
              <text x="340" y="145" fill="#4ade80" fontFamily="monospace" fontSize="10" textAnchor="middle">← Inbound Stream Frames (Simultaneous)</text>
            </>
          )}
        </svg>

        <div className="mt-3 border-t border-fd-border/60 pt-2 text-center font-mono text-xs text-fd-muted-foreground">
          {mode === 'unary' && 'Unary: Classic RPC. One request message results in one response message.'}
          {mode === 'server' && 'Server Streaming: Used for stock tickers, telemetry monitors, and live news feeds.'}
          {mode === 'client' && 'Client Streaming: Used for heavy IoT logs, file uploads, and bulk biometric ingestion.'}
          {mode === 'bidi' && 'Bidirectional: Used for low-latency multiplayer gaming, VOIP, and live chat engines.'}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. ARCHITECTURE DECISION CALCULATOR (SCORING MATRIX)
// ============================================================================

interface ArchSpec {
  perf: number;
  simplicity: number;
  security: number;
  realtime: number;
  description: string;
}

const ARCH_CONFIG: Record<string, ArchSpec> = {
  REST: {
    perf: 1,
    simplicity: 3,
    security: 1,
    realtime: 0,
    description: 'Standard, battle-tested, universally cacheable default for public web services and general SaaS.',
  },
  SOAP: {
    perf: 0,
    simplicity: 0,
    security: 3,
    realtime: 0,
    description: 'Enterprise formal contract with WSDL and WS-Security for banks, medical systems, and compliance-heavy audits.',
  },
  GraphQL: {
    perf: 2,
    simplicity: 2,
    security: 1,
    realtime: 1,
    description: 'Ideal when clients (mobile & web) need tailor-made query shapes to prevent excessive round trips and over-fetching.',
  },
  gRPC: {
    perf: 3,
    simplicity: 1,
    security: 3,
    realtime: 3,
    description: 'Ultra high-throughput microservices and real-time streaming using HTTP/2 binary Protocol Buffers.',
  },
};

export function ApiArchitectureChooser() {
  const [perfWeight, setPerfWeight] = useState<number>(1);
  const [simplicityWeight, setSimplicityWeight] = useState<number>(2);
  const [securityWeight, setSecurityWeight] = useState<number>(1);
  const [realtimeWeight, setRealtimeWeight] = useState<number>(0);

  const calculateScores = () => {
    const scores: Record<string, number> = {};
    let maxScore = 0;

    Object.entries(ARCH_CONFIG).forEach(([name, spec]) => {
      const score =
        spec.perf * perfWeight +
        spec.simplicity * simplicityWeight +
        spec.security * securityWeight +
        spec.realtime * realtimeWeight;
      scores[name] = score;
      if (score > maxScore) maxScore = score;
    });

    let winner = 'REST';
    let highest = -1;
    Object.entries(scores).forEach(([name, s]) => {
      if (s > highest) {
        highest = s;
        winner = name;
      }
    });

    return { scores, maxScore, winner };
  };

  const { scores, maxScore, winner } = calculateScores();

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-fd-border pb-3">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-fd-foreground">
            <Sliders className="h-4 w-4 text-amber-400" />
            Interactive API Architecture Decision Recommender
          </h4>
          <p className="text-xs text-fd-muted-foreground">
            Adjust your project constraints to compute real-time scores across REST, SOAP, GraphQL, and gRPC.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-fd-foreground">Performance & Throughput:</span>
              <span className="font-bold text-amber-400">
                {perfWeight === 0 ? 'Low' : perfWeight === 1 ? 'Medium' : perfWeight === 2 ? 'High' : 'Ultra'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              value={perfWeight}
              onChange={(e) => setPerfWeight(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-fd-foreground">Simplicity & Developer Adoption:</span>
              <span className="font-bold text-amber-400">
                {simplicityWeight === 0 ? 'Low' : simplicityWeight === 1 ? 'Medium' : simplicityWeight === 2 ? 'High' : 'Critical'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              value={simplicityWeight}
              onChange={(e) => setSimplicityWeight(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-fd-foreground">Strict Contract & WS-Security:</span>
              <span className="font-bold text-amber-400">
                {securityWeight === 0 ? 'Basic' : securityWeight === 1 ? 'Standard' : securityWeight === 2 ? 'High' : 'Strict/Audited'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              value={securityWeight}
              onChange={(e) => setSecurityWeight(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-fd-foreground">Real-Time / Streaming Demand:</span>
              <span className="font-bold text-amber-400">
                {realtimeWeight === 0 ? 'None' : realtimeWeight === 1 ? 'Occasional' : realtimeWeight === 2 ? 'Substantial' : 'Mission-Critical'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              value={realtimeWeight}
              onChange={(e) => setRealtimeWeight(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Results Card */}
        <div className="flex flex-col justify-between rounded-lg border border-fd-border bg-fd-background p-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-fd-muted-foreground">Recommended Style</div>
            <div className="text-2xl font-bold text-amber-400 mb-1">{winner}</div>
            <p className="text-xs text-fd-muted-foreground leading-relaxed">{ARCH_CONFIG[winner].description}</p>

            <div className="mt-4 space-y-2">
              {Object.entries(scores).map(([name, score]) => {
                const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
                const isSelected = name === winner;
                return (
                  <div key={name} className="space-y-0.5">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className={isSelected ? 'font-bold text-amber-400' : 'text-fd-muted-foreground'}>
                        {name}
                      </span>
                      <span className={isSelected ? 'font-bold text-amber-400' : 'text-fd-muted-foreground'}>
                        Score: {score}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-fd-muted overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isSelected ? 'bg-amber-400' : 'bg-fd-border'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. API KEY SECURITY & LEAK SIMULATOR
// ============================================================================

export function ApiKeySecuritySimulator() {
  const [architectureMode, setArchitectureMode] = useState<'vulnerable' | 'secure'>('vulnerable');

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card/50 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-fd-border pb-3">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-fd-foreground">
            <Key className="h-4 w-4 text-rose-400" />
            Interactive API Key Security & Leak Simulator
          </h4>
          <p className="text-xs text-fd-muted-foreground">
            Compare why embedding API keys in frontend code leads to immediate compromise vs. the Backend Proxy pattern.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setArchitectureMode('vulnerable')}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-xs font-semibold transition-all ${
              architectureMode === 'vulnerable'
                ? 'border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-sm'
                : 'border-fd-border bg-fd-card text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Vulnerable (Client Bundle)
          </button>
          <button
            onClick={() => setArchitectureMode('secure')}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-xs font-semibold transition-all ${
              architectureMode === 'secure'
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-sm'
                : 'border-fd-border bg-fd-card text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure (BFF Proxy)
          </button>
        </div>
      </div>

      {architectureMode === 'vulnerable' ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-rose-400">CRITICAL: Client-Side Secret Exposure</h5>
                <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                  When secret keys (OpenAI, AWS, Stripe Secret) are written inside React/Next.js frontend components, they are compiled into public JavaScript bundle files. Any user can press <kbd className="bg-rose-950 text-rose-200 px-1 py-0.5 rounded">F12</kbd>, view the Network tab or Sources, and steal the key.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 font-mono text-xs">
            <div className="rounded-lg border border-fd-border bg-fd-background p-3.5">
              <div className="mb-2 text-rose-400 font-semibold border-b border-fd-border pb-1">
                Frontend Component: `components/weather-widget.tsx`
              </div>
              <pre className="text-[11px] leading-relaxed text-fd-muted-foreground overflow-x-auto">
{`// ❌ DANGEROUS: Secret key baked into public JS bundle!
export function WeatherWidget() {
  const API_KEY = "sk_live_98a7cf28941098bd"; // LEAKED!

  const fetchWeather = async () => {
    return fetch(\`https://api.weather.com?key=\${API_KEY}\`);
  };
}`}
              </pre>
            </div>

            <div className="rounded-lg border border-fd-border bg-fd-background p-3.5">
              <div className="mb-2 text-rose-400 font-semibold border-b border-fd-border pb-1">
                Attacker Browser DevTools (Sources / Network)
              </div>
              <pre className="text-[11px] leading-relaxed text-rose-400 overflow-x-auto">
{`// ⚠️ Attacker extracts raw key in 2 seconds:
$ curl -H "Authorization: Bearer sk_live_98a7cf..." \\
  https://api.provider.com/v1/billing

// RESULT:
// • Attacker drains your account credits ($5,000 billing surge)
// • Attacker deletes all cloud databases
// • Automated GitHub scraper steals key within 90 seconds`}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-emerald-400">SECURE: Backend Proxy & Secret Isolation</h5>
                <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                  The client browser only talks to your own backend API route (`/api/weather`). Your backend reads the secret key securely from server-side environment variables, attaches it in private memory, and queries the third-party API. The client never sees the secret key!
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 font-mono text-xs">
            <div className="rounded-lg border border-fd-border bg-fd-background p-3.5">
              <div className="mb-2 text-emerald-400 font-semibold border-b border-fd-border pb-1">
                Client Component: `app/page.tsx`
              </div>
              <pre className="text-[11px] leading-relaxed text-fd-foreground overflow-x-auto">
{`// ✅ SECURE: Client only calls internal backend proxy
export function WeatherWidget() {
  const fetchWeather = async () => {
    // Zero secret keys in frontend code!
    return fetch('/api/weather?city=SanFrancisco');
  };
}`}
              </pre>
            </div>

            <div className="rounded-lg border border-fd-border bg-fd-background p-3.5">
              <div className="mb-2 text-emerald-400 font-semibold border-b border-fd-border pb-1">
                Secure Next.js Route Handler: `app/api/weather/route.ts`
              </div>
              <pre className="text-[11px] leading-relaxed text-emerald-400 overflow-x-auto">
{`import { env } from '@/env'; // Type-safe server env

export async function GET(req: Request) {
  // Key exists strictly in server RAM!
  const apiKey = env.WEATHER_SECRET_KEY; 

  const res = await fetch(
    \`https://api.weather.com?key=\${apiKey}\`
  );
  return Response.json(await res.json());
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
