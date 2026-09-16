import { ApiEndpointMetrics } from '../types';

export const INITIAL_API_ENDPOINTS: ApiEndpointMetrics[] = [
  {
    id: 'ep-agent-execute',
    path: '/api/v1/agents/execute',
    method: 'POST',
    service: 'Agent Orchestrator',
    description: 'Main multi-step reactive loop driving agent reasoning, tool dispatch, and decision synthesis.',
    latencyP50Ms: 245,
    latencyP90Ms: 680,
    latencyP95Ms: 1120,
    latencyP99Ms: 2450,
    avgLatencyMs: 412,
    minLatencyMs: 94,
    maxLatencyMs: 4890,
    errorRate: 1.42,
    throughputRps: 184.6,
    rpm: 11076,
    totalRequests24h: 1594800,
    statusCodes: {
      code2xx: 1572160,
      code3xx: 0,
      code4xx: 14200,
      code5xx: 8440
    },
    apdexScore: 0.94,
    status: 'healthy',
    latencyBreakdown: {
      inferenceMs: 248,
      toolsMs: 112,
      dbMs: 34,
      networkMs: 18
    },
    sparkline: [380, 410, 395, 420, 450, 430, 415, 390, 440, 480, 420, 412],
    recentTimeseries: [
      { timestamp: '14:35', rps: 172, latencyAvg: 395, p95: 1050, p99: 2200, errorRate: 1.1, status2xx: 170, status4xx: 2, status5xx: 0 },
      { timestamp: '14:40', rps: 185, latencyAvg: 410, p95: 1090, p99: 2310, errorRate: 1.3, status2xx: 182, status4xx: 2, status5xx: 1 },
      { timestamp: '14:45', rps: 198, latencyAvg: 430, p95: 1180, p99: 2490, errorRate: 1.8, status2xx: 194, status4xx: 3, status5xx: 1 },
      { timestamp: '14:50', rps: 210, latencyAvg: 445, p95: 1210, p99: 2580, errorRate: 1.9, status2xx: 206, status4xx: 3, status5xx: 1 },
      { timestamp: '14:55', rps: 192, latencyAvg: 420, p95: 1140, p99: 2420, errorRate: 1.5, status2xx: 189, status4xx: 2, status5xx: 1 },
      { timestamp: '15:00', rps: 180, latencyAvg: 405, p95: 1080, p99: 2290, errorRate: 1.2, status2xx: 177, status4xx: 2, status5xx: 1 },
      { timestamp: '15:05', rps: 184, latencyAvg: 412, p95: 1120, p99: 2450, errorRate: 1.4, status2xx: 181, status4xx: 2, status5xx: 1 }
    ],
    topErrors: [
      { status: 504, message: 'Gateway Timeout: Downstream tool execution exceeded 10000ms deadline', count: 42, lastSeen: '4m ago', sampleTraceId: 'tr-7921' },
      { status: 429, message: 'QuotaExceeded: Model inference concurrency threshold reached (100 req/s)', count: 28, lastSeen: '11m ago', sampleTraceId: 'tr-9402' },
      { status: 400, message: 'InvalidToolSignatureError: Missing parameter `order_id` in AST binding', count: 14, lastSeen: '18m ago', sampleTraceId: 'tr-6512' }
    ],
    upstreamCallers: ['Web Client UI', 'Batch Runner Service', 'Webhook Ingress'],
    downstreamDependencies: ['Model Gateway', 'Tool Proxy', 'Vector Index', 'Evaluator Engine']
  },
  {
    id: 'ep-models-generate',
    path: '/api/v1/models/generate',
    method: 'POST',
    service: 'Model Gateway',
    description: 'High-throughput LLM gateway routing to Gemini 2.5 Pro, Claude 3.7 Sonnet, and GPT-4o with semantic caching.',
    latencyP50Ms: 380,
    latencyP90Ms: 1420,
    latencyP95Ms: 2150,
    latencyP99Ms: 4200,
    avgLatencyMs: 640,
    minLatencyMs: 120,
    maxLatencyMs: 8900,
    errorRate: 0.88,
    throughputRps: 245.2,
    rpm: 14712,
    totalRequests24h: 2118500,
    statusCodes: {
      code2xx: 2099850,
      code3xx: 0,
      code4xx: 12400,
      code5xx: 6250
    },
    apdexScore: 0.91,
    status: 'healthy',
    latencyBreakdown: {
      inferenceMs: 560,
      toolsMs: 0,
      dbMs: 42,
      networkMs: 38
    },
    sparkline: [620, 650, 680, 710, 630, 590, 610, 640, 670, 655, 630, 640],
    recentTimeseries: [
      { timestamp: '14:35', rps: 230, latencyAvg: 610, p95: 2050, p99: 4100, errorRate: 0.7, status2xx: 228, status4xx: 1, status5xx: 1 },
      { timestamp: '14:40', rps: 242, latencyAvg: 630, p95: 2120, p99: 4180, errorRate: 0.8, status2xx: 240, status4xx: 1, status5xx: 1 },
      { timestamp: '14:45', rps: 260, latencyAvg: 670, p95: 2280, p99: 4350, errorRate: 1.1, status2xx: 257, status4xx: 2, status5xx: 1 },
      { timestamp: '14:50', rps: 255, latencyAvg: 655, p95: 2210, p99: 4290, errorRate: 0.9, status2xx: 252, status4xx: 2, status5xx: 1 },
      { timestamp: '14:55', rps: 248, latencyAvg: 640, p95: 2150, p99: 4210, errorRate: 0.8, status2xx: 246, status4xx: 1, status5xx: 1 },
      { timestamp: '15:00', rps: 240, latencyAvg: 625, p95: 2100, p99: 4150, errorRate: 0.8, status2xx: 238, status4xx: 1, status5xx: 1 },
      { timestamp: '15:05', rps: 245, latencyAvg: 640, p95: 2150, p99: 4200, errorRate: 0.9, status2xx: 243, status4xx: 1, status5xx: 1 }
    ],
    topErrors: [
      { status: 429, message: 'ResourceExhausted: Provider token bucket depleted for tenant sandbox', count: 35, lastSeen: '2m ago', sampleTraceId: 'tr-8831' },
      { status: 503, message: 'ProviderServiceUnavailable: Upstream cloud cluster returned 503 transient drop', count: 19, lastSeen: '9m ago', sampleTraceId: 'tr-9104' }
    ],
    upstreamCallers: ['Agent Orchestrator', 'Evaluator Engine', 'Playground UI'],
    downstreamDependencies: ['Google Gemini API', 'Anthropic API', 'OpenAI API']
  },
  {
    id: 'ep-evaluators-evaluate',
    path: '/api/v1/evaluators/evaluate',
    method: 'POST',
    service: 'Evaluator Engine',
    description: 'Autonomous hallucination, claim verification, groundedness, and behavioral drift scoring.',
    latencyP50Ms: 190,
    latencyP90Ms: 510,
    latencyP95Ms: 780,
    latencyP99Ms: 1450,
    avgLatencyMs: 285,
    minLatencyMs: 65,
    maxLatencyMs: 3100,
    errorRate: 0.45,
    throughputRps: 112.4,
    rpm: 6744,
    totalRequests24h: 971000,
    statusCodes: {
      code2xx: 966630,
      code3xx: 0,
      code4xx: 3120,
      code5xx: 1250
    },
    apdexScore: 0.98,
    status: 'healthy',
    latencyBreakdown: {
      inferenceMs: 210,
      toolsMs: 0,
      dbMs: 50,
      networkMs: 25
    },
    sparkline: [270, 280, 290, 275, 310, 295, 280, 285, 290, 275, 280, 285],
    recentTimeseries: [
      { timestamp: '14:35', rps: 105, latencyAvg: 275, p95: 750, p99: 1390, errorRate: 0.4, status2xx: 104, status4xx: 1, status5xx: 0 },
      { timestamp: '14:40', rps: 110, latencyAvg: 280, p95: 760, p99: 1410, errorRate: 0.4, status2xx: 109, status4xx: 1, status5xx: 0 },
      { timestamp: '14:45', rps: 118, latencyAvg: 295, p95: 810, p99: 1520, errorRate: 0.6, status2xx: 117, status4xx: 1, status5xx: 0 },
      { timestamp: '14:50', rps: 115, latencyAvg: 290, p95: 790, p99: 1480, errorRate: 0.5, status2xx: 114, status4xx: 1, status5xx: 0 },
      { timestamp: '14:55', rps: 112, latencyAvg: 282, p95: 770, p99: 1440, errorRate: 0.4, status2xx: 111, status4xx: 1, status5xx: 0 },
      { timestamp: '15:00', rps: 109, latencyAvg: 278, p95: 760, p99: 1420, errorRate: 0.4, status2xx: 108, status4xx: 1, status5xx: 0 },
      { timestamp: '15:05', rps: 112, latencyAvg: 285, p95: 780, p99: 1450, errorRate: 0.4, status2xx: 111, status4xx: 1, status5xx: 0 }
    ],
    topErrors: [
      { status: 422, message: 'UnprocessableEntity: Target text does not contain extractable claims for GroundednessCheck', count: 18, lastSeen: '8m ago', sampleTraceId: 'tr-5120' }
    ],
    upstreamCallers: ['Agent Orchestrator', 'CI/CD Regression Pipeline'],
    downstreamDependencies: ['Model Gateway', 'Vector Index']
  },
  {
    id: 'ep-tools-dispatch',
    path: '/api/v1/tools/dispatch',
    method: 'POST',
    service: 'Tool Proxy Sandbox',
    description: 'Secure gRPC isolation sandbox for code execution, SQL query runners, and external HTTP fetches.',
    latencyP50Ms: 410,
    latencyP90Ms: 1850,
    latencyP95Ms: 2980,
    latencyP99Ms: 6400,
    avgLatencyMs: 820,
    minLatencyMs: 45,
    maxLatencyMs: 12400,
    errorRate: 4.85,
    throughputRps: 92.5,
    rpm: 5550,
    totalRequests24h: 799200,
    statusCodes: {
      code2xx: 760440,
      code3xx: 0,
      code4xx: 19800,
      code5xx: 18960
    },
    apdexScore: 0.78,
    status: 'degraded',
    latencyBreakdown: {
      inferenceMs: 0,
      toolsMs: 680,
      dbMs: 85,
      networkMs: 55
    },
    sparkline: [750, 780, 890, 920, 840, 810, 830, 860, 910, 880, 830, 820],
    recentTimeseries: [
      { timestamp: '14:35', rps: 88, latencyAvg: 780, p95: 2820, p99: 6100, errorRate: 4.2, status2xx: 84, status4xx: 2, status5xx: 2 },
      { timestamp: '14:40', rps: 91, latencyAvg: 810, p95: 2910, p99: 6250, errorRate: 4.6, status2xx: 87, status4xx: 2, status5xx: 2 },
      { timestamp: '14:45', rps: 98, latencyAvg: 890, p95: 3200, p99: 6800, errorRate: 5.8, status2xx: 92, status4xx: 3, status5xx: 3 },
      { timestamp: '14:50', rps: 95, latencyAvg: 860, p95: 3100, p99: 6600, errorRate: 5.2, status2xx: 90, status4xx: 3, status5xx: 2 },
      { timestamp: '14:55', rps: 93, latencyAvg: 830, p95: 3010, p99: 6480, errorRate: 4.8, status2xx: 88, status4xx: 3, status5xx: 2 },
      { timestamp: '15:00', rps: 90, latencyAvg: 815, p95: 2950, p99: 6350, errorRate: 4.5, status2xx: 86, status4xx: 2, status5xx: 2 },
      { timestamp: '15:05', rps: 92, latencyAvg: 820, p95: 2980, p99: 6400, errorRate: 4.8, status2xx: 88, status4xx: 2, status5xx: 2 }
    ],
    topErrors: [
      { status: 504, message: 'ExecutionTimeout: AST Parser sandbox exceeded wall-clock limit (5000ms)', count: 86, lastSeen: '1m ago', sampleTraceId: 'tr-7921' },
      { status: 502, message: 'BadGateway: Upstream exchange websocket disconnected during orderbook sync', count: 48, lastSeen: '6m ago', sampleTraceId: 'tr-4419' },
      { status: 400, message: 'DialectSyntaxError: Generated SQL partition filter violates ClickHouse schema', count: 32, lastSeen: '12m ago', sampleTraceId: 'tr-3108' }
    ],
    upstreamCallers: ['Agent Orchestrator', 'Telemetry Lab'],
    downstreamDependencies: ['Isolated Docker Sandbox', 'PostgreSQL / ClickHouse', 'Third-Party Web APIs']
  },
  {
    id: 'ep-vectors-search',
    path: '/api/v1/vectors/similarity-search',
    method: 'POST',
    service: 'Vector Index',
    description: 'HNSW hybrid dense-sparse vector index retrieval for contextual memory and RAG grounding.',
    latencyP50Ms: 85,
    latencyP90Ms: 195,
    latencyP95Ms: 280,
    latencyP99Ms: 510,
    avgLatencyMs: 112,
    minLatencyMs: 28,
    maxLatencyMs: 1450,
    errorRate: 0.12,
    throughputRps: 310.8,
    rpm: 18648,
    totalRequests24h: 2685000,
    statusCodes: {
      code2xx: 2681780,
      code3xx: 0,
      code4xx: 2100,
      code5xx: 1120
    },
    apdexScore: 0.99,
    status: 'healthy',
    latencyBreakdown: {
      inferenceMs: 38,
      toolsMs: 0,
      dbMs: 62,
      networkMs: 12
    },
    sparkline: [105, 110, 115, 120, 112, 108, 110, 114, 118, 110, 109, 112],
    recentTimeseries: [
      { timestamp: '14:35', rps: 295, latencyAvg: 108, p95: 270, p99: 490, errorRate: 0.1, status2xx: 294, status4xx: 1, status5xx: 0 },
      { timestamp: '14:40', rps: 308, latencyAvg: 112, p95: 278, p99: 505, errorRate: 0.1, status2xx: 307, status4xx: 1, status5xx: 0 },
      { timestamp: '14:45', rps: 325, latencyAvg: 118, p95: 295, p99: 535, errorRate: 0.2, status2xx: 324, status4xx: 1, status5xx: 0 },
      { timestamp: '14:50', rps: 320, latencyAvg: 115, p95: 288, p99: 520, errorRate: 0.1, status2xx: 319, status4xx: 1, status5xx: 0 },
      { timestamp: '14:55', rps: 314, latencyAvg: 112, p95: 282, p99: 512, errorRate: 0.1, status2xx: 313, status4xx: 1, status5xx: 0 },
      { timestamp: '15:00', rps: 305, latencyAvg: 109, p95: 275, p99: 502, errorRate: 0.1, status2xx: 304, status4xx: 1, status5xx: 0 },
      { timestamp: '15:05', rps: 310, latencyAvg: 112, p95: 280, p99: 510, errorRate: 0.1, status2xx: 309, status4xx: 1, status5xx: 0 }
    ],
    topErrors: [
      { status: 400, message: 'DimensionMismatch: Query embedding dim (1536) does not match namespace dim (3072)', count: 12, lastSeen: '25m ago', sampleTraceId: 'tr-2041' }
    ],
    upstreamCallers: ['Agent Orchestrator', 'Evaluator Engine'],
    downstreamDependencies: ['Pinecone Vector DB', 'Milvus Cluster']
  },
  {
    id: 'ep-traces-query',
    path: '/api/v1/traces/query',
    method: 'GET',
    service: 'Telemetry Ingestion & Query',
    description: 'High-speed analytical span retrieval, tag indexing, and OpenTelemetry trace filtering.',
    latencyP50Ms: 74,
    latencyP90Ms: 165,
    latencyP95Ms: 230,
    latencyP99Ms: 440,
    avgLatencyMs: 95,
    minLatencyMs: 18,
    maxLatencyMs: 1200,
    errorRate: 0.08,
    throughputRps: 154.2,
    rpm: 9252,
    totalRequests24h: 1332000,
    statusCodes: {
      code2xx: 1330930,
      code3xx: 0,
      code4xx: 850,
      code5xx: 220
    },
    apdexScore: 0.99,
    status: 'healthy',
    latencyBreakdown: {
      inferenceMs: 0,
      toolsMs: 0,
      dbMs: 78,
      networkMs: 17
    },
    sparkline: [90, 92, 98, 105, 96, 94, 91, 95, 102, 97, 93, 95],
    recentTimeseries: [
      { timestamp: '14:35', rps: 145, latencyAvg: 92, p95: 220, p99: 420, errorRate: 0.05, status2xx: 145, status4xx: 0, status5xx: 0 },
      { timestamp: '14:40', rps: 152, latencyAvg: 95, p95: 228, p99: 435, errorRate: 0.07, status2xx: 152, status4xx: 0, status5xx: 0 },
      { timestamp: '14:45', rps: 162, latencyAvg: 101, p95: 242, p99: 460, errorRate: 0.10, status2xx: 162, status4xx: 0, status5xx: 0 },
      { timestamp: '14:50', rps: 158, latencyAvg: 98, p95: 235, p99: 450, errorRate: 0.08, status2xx: 158, status4xx: 0, status5xx: 0 },
      { timestamp: '14:55', rps: 155, latencyAvg: 95, p95: 230, p99: 440, errorRate: 0.07, status2xx: 155, status4xx: 0, status5xx: 0 },
      { timestamp: '15:00', rps: 150, latencyAvg: 93, p95: 225, p99: 430, errorRate: 0.06, status2xx: 150, status4xx: 0, status5xx: 0 },
      { timestamp: '15:05', rps: 154, latencyAvg: 95, p95: 230, p99: 440, errorRate: 0.08, status2xx: 154, status4xx: 0, status5xx: 0 }
    ],
    topErrors: [
      { status: 400, message: 'InvalidTimeRange: `start_time` cannot exceed 30 days retention horizon', count: 6, lastSeen: '34m ago' }
    ],
    upstreamCallers: ['AgentPulse Dashboard', 'Alert Notification Bot', 'Prometheus Exporter'],
    downstreamDependencies: ['ClickHouse Columnar Store', 'Redis Cache']
  },
  {
    id: 'ep-guardrails-inspect',
    path: '/api/v1/guardrails/inspect',
    method: 'POST',
    service: 'Safety & Firewall Proxy',
    description: 'Sub-millisecond prompt injection barrier, jailbreak scanner, and PII anonymization interceptor.',
    latencyP50Ms: 32,
    latencyP90Ms: 78,
    latencyP95Ms: 110,
    latencyP99Ms: 220,
    avgLatencyMs: 46,
    minLatencyMs: 12,
    maxLatencyMs: 580,
    errorRate: 0.32,
    throughputRps: 260.4,
    rpm: 15624,
    totalRequests24h: 2249800,
    statusCodes: {
      code2xx: 2242600,
      code3xx: 0,
      code4xx: 6400,
      code5xx: 800
    },
    apdexScore: 0.99,
    status: 'healthy',
    latencyBreakdown: {
      inferenceMs: 28,
      toolsMs: 0,
      dbMs: 10,
      networkMs: 8
    },
    sparkline: [44, 46, 48, 52, 45, 43, 44, 47, 50, 48, 45, 46],
    recentTimeseries: [
      { timestamp: '14:35', rps: 250, latencyAvg: 44, p95: 105, p99: 210, errorRate: 0.3, status2xx: 249, status4xx: 1, status5xx: 0 },
      { timestamp: '14:40', rps: 258, latencyAvg: 46, p95: 108, p99: 215, errorRate: 0.3, status2xx: 257, status4xx: 1, status5xx: 0 },
      { timestamp: '14:45', rps: 275, latencyAvg: 50, p95: 118, p99: 232, errorRate: 0.4, status2xx: 274, status4xx: 1, status5xx: 0 },
      { timestamp: '14:50', rps: 270, latencyAvg: 48, p95: 114, p99: 226, errorRate: 0.3, status2xx: 269, status4xx: 1, status5xx: 0 },
      { timestamp: '14:55', rps: 264, latencyAvg: 46, p95: 110, p99: 218, errorRate: 0.3, status2xx: 263, status4xx: 1, status5xx: 0 },
      { timestamp: '15:00', rps: 256, latencyAvg: 44, p95: 106, p99: 212, errorRate: 0.3, status2xx: 255, status4xx: 1, status5xx: 0 },
      { timestamp: '15:05', rps: 260, latencyAvg: 46, p95: 110, p99: 220, errorRate: 0.3, status2xx: 259, status4xx: 1, status5xx: 0 }
    ],
    topErrors: [
      { status: 403, message: 'PolicyViolation: Prompt Injection attempt detected (Regex Heuristic: System Override)', count: 24, lastSeen: '5m ago', sampleTraceId: 'tr-1102' }
    ],
    upstreamCallers: ['Agent Orchestrator', 'Model Gateway'],
    downstreamDependencies: ['Wasm Heuristic Scanner', 'Local Embedding Classifier']
  }
];
