import { Agent, Trace, Incident, DriftProfile, Dataset, Experiment } from '../types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-arbitrage-alpha',
    name: 'Arbitrage & Market Intelligence Agent',
    version: 'v2.4.1',
    model: 'gemini-2.5-pro',
    status: 'idle',
    latencyAvgMs: 412,
    costPerHour: 0.18,
    successRate: 99.4,
    totalTraces24h: 18420,
    description: 'High-frequency order-book disparity & multi-exchange liquidity synthesizer.',
    framework: 'LangGraph',
    driftScore: 0.04,
    driftStatus: 'normal',
    lastActive: '12s ago',
    tools: ['fetch_order_book', 'calc_spread', 'check_collateral', 'simulate_slippage']
  },
  {
    id: 'agent-code-auditor',
    name: 'Autonomous Code Auditor & Vulnerability Scanner',
    version: 'v1.9.0',
    model: 'claude-3-7-sonnet',
    status: 'running',
    latencyAvgMs: 1240,
    costPerHour: 0.84,
    successRate: 98.1,
    totalTraces24h: 3290,
    description: 'AST-driven static analysis, tainted flow verification, and CVE correlation.',
    framework: 'LlamaIndex',
    driftScore: 0.12,
    driftStatus: 'normal',
    lastActive: 'Just now',
    tools: ['parse_ast', 'query_cve_db', 'simulate_exploit_payload', 'verify_patch']
  },
  {
    id: 'agent-claims-triage',
    name: 'Customer Claims & Policy Verification Agent',
    version: 'v3.1.2',
    model: 'gpt-4o',
    status: 'warning',
    latencyAvgMs: 890,
    costPerHour: 0.42,
    successRate: 91.2,
    totalTraces24h: 8400,
    description: 'Multi-document claim matching, fraud anomaly scoring, and policy rule verification.',
    framework: 'CrewAI',
    driftScore: 0.46,
    driftStatus: 'deviation',
    lastActive: '4s ago',
    tools: ['ocr_receipt_extract', 'query_policy_db', 'fraud_risk_scorer', 'calc_reimbursement']
  },
  {
    id: 'agent-sql-synthesizer',
    name: 'Autonomous Data Lake SQL Synthesizer',
    version: 'v1.4.0',
    model: 'gemini-2.5-flash',
    status: 'critical',
    latencyAvgMs: 2450,
    costPerHour: 0.65,
    successRate: 74.8,
    totalTraces24h: 12150,
    description: 'Natural language to multi-dialect distributed analytical SQL engine with dialect validation.',
    framework: 'Custom Orchestrator',
    driftScore: 0.82,
    driftStatus: 'drift',
    lastActive: '1m ago',
    tools: ['schema_catalog_lookup', 'sql_dry_run_explain', 'partition_cost_estimator', 'execute_analytic_query']
  }
];

export const INITIAL_TRACES: Trace[] = [
  {
    id: 'tr-98410',
    agentId: 'agent-sql-synthesizer',
    agentName: 'Autonomous Data Lake SQL Synthesizer',
    sessionId: 'sess-84091',
    rootSpanId: 'sp-01',
    status: 'error',
    durationMs: 2840,
    totalTokens: 4210,
    cost: 0.0084,
    timestamp: '2026-08-31 10:32:15',
    inputPreview: 'Aggregate Q3 customer retention cohort by geographic tier and cloud usage bucket',
    outputPreview: 'Execution aborted: schema resolution conflict in table `analytics.fact_cohort_v3`. Column `usage_tier_id` not found.',
    errorSummary: 'Dialect mismatch & schema hallucination in generated Trino query',
    driftDetected: true,
    groundingScore: 0.42,
    tags: ['production', 'cohort-query', 'schema-drift'],
    spans: [
      {
        id: 'sp-01',
        traceId: 'tr-98410',
        name: 'orchestrator.execute_sql_pipeline',
        type: 'agent',
        status: 'error',
        startOffsetMs: 0,
        durationMs: 2840,
        agentLane: 'Synthesizer Core',
        model: 'gemini-2.5-flash',
        prompt: 'User requested complex cohort retention breakdown. Plan schema lookups and generate dialect-safe SQL.',
        completion: 'Schema catalog lookup failed on partition keys. Attempted fallback query generation.',
        tokens: { prompt: 1400, completion: 2810, total: 4210 },
        cost: 0.0084,
        error: 'Schema column `usage_tier_id` does not exist in target warehouse metadata.',
        evidence: {
          observed: 'Agent generated column reference `t.usage_tier_id` on line 14 of SQL output.',
          measured: 'Catalog reflection confirmed column is named `t.tier_identifier_code`. Discrepancy score: 0.89.',
          explained: 'Model hallucinated column name based on prior deprecated v2 schema cached in system context.'
        },
        evaluatorResults: [
          {
            id: 'eval-grounding',
            name: 'Schema Groundedness',
            score: 0.42,
            threshold: 0.85,
            passed: false,
            maturity: 'BETA',
            reason: 'Generated query contains 2 non-grounded identifiers not present in catalog schema payload.',
            evidenceQuote: 'SELECT t.usage_tier_id, date_trunc(\'month\', event_time)...'
          },
          {
            id: 'eval-toolclaim',
            name: 'Tool-Claim Alignment',
            score: 0.38,
            threshold: 0.80,
            passed: false,
            maturity: 'EXPERIMENTAL',
            reason: 'Claimed tool execution succeeded, but `sql_dry_run_explain` returned exit code 1 with semantic error.',
            evidenceQuote: 'Tool output: "SemanticException [Error 10004]: Invalid table alias or column reference"'
          }
        ]
      },
      {
        id: 'sp-02',
        traceId: 'tr-98410',
        parentSpanId: 'sp-01',
        name: 'catalog.lookup_schema',
        type: 'tool',
        status: 'ok',
        startOffsetMs: 120,
        durationMs: 340,
        agentLane: 'Metadata Engine',
        toolName: 'schema_catalog_lookup',
        toolArgs: { tables: ['analytics.fact_cohort_v3', 'analytics.dim_tenants'] },
        toolOutput: { status: 'found', valid_columns: ['tenant_id', 'tier_identifier_code', 'signup_epoch', 'bytes_ingested'] },
        tokens: { prompt: 210, completion: 180, total: 390 }
      },
      {
        id: 'sp-03',
        traceId: 'tr-98410',
        parentSpanId: 'sp-01',
        name: 'model.generate_trino_query',
        type: 'model',
        status: 'warning',
        startOffsetMs: 480,
        durationMs: 1420,
        agentLane: 'Synthesizer Core',
        model: 'gemini-2.5-flash',
        prompt: 'Generate valid Trino SQL with partition pruning. Table has columns: [tenant_id, tier_identifier_code...]',
        completion: 'WITH cohorts AS (SELECT tenant_id, usage_tier_id, count(*) FROM analytics.fact_cohort_v3 GROUP BY 1, 2) SELECT * FROM cohorts;',
        tokens: { prompt: 1100, completion: 490, total: 1590 }
      },
      {
        id: 'sp-04',
        traceId: 'tr-98410',
        parentSpanId: 'sp-01',
        name: 'tool.sql_dry_run_explain',
        type: 'tool',
        status: 'error',
        startOffsetMs: 1920,
        durationMs: 780,
        agentLane: 'Validation Engine',
        toolName: 'sql_dry_run_explain',
        toolArgs: { dialect: 'trino', sql: 'SELECT tenant_id, usage_tier_id...' },
        toolOutput: { error: 'Column usage_tier_id cannot be resolved', error_code: 'COLUMN_NOT_FOUND' },
        error: 'Dry-run verification rejected generated query.'
      }
    ]
  },
  {
    id: 'tr-98409',
    agentId: 'agent-claims-triage',
    agentName: 'Customer Claims & Policy Verification Agent',
    sessionId: 'sess-84088',
    rootSpanId: 'sp-10',
    status: 'warning',
    durationMs: 1180,
    totalTokens: 3100,
    cost: 0.0062,
    timestamp: '2026-08-31 10:31:02',
    inputPreview: 'Process physical therapy reimbursement claim #CLM-8924 for policyholder Jordan Vance',
    outputPreview: 'Claim approved provisionally for $420.00. Warning: Missing therapist clinic NPI number on OCR receipt.',
    errorSummary: 'Confidence threshold warning on receipt OCR therapist certification',
    driftDetected: true,
    groundingScore: 0.78,
    tags: ['claims', 'ocr', 'policy-v3'],
    spans: [
      {
        id: 'sp-10',
        traceId: 'tr-98409',
        name: 'claims.evaluate_submission',
        type: 'agent',
        status: 'warning',
        startOffsetMs: 0,
        durationMs: 1180,
        agentLane: 'Claims Triage',
        model: 'gpt-4o',
        prompt: 'Verify claim receipt CLM-8924 against policy coverage tier Silver Plus.',
        completion: 'Receipt items match deductible criteria; therapist NPI is partially smudged on scan.',
        tokens: { prompt: 1800, completion: 1300, total: 3100 },
        evidence: {
          observed: 'OCR extracted therapist NPI as `18372*****` with 62% character confidence.',
          measured: 'Policy requires verified 10-digit NPI before automatic payout disbursement.',
          explained: 'Agent applied provisional approval rather than flagging for human supervisor review.'
        },
        evaluatorResults: [
          {
            id: 'eval-policy-strict',
            name: 'Policy Compliance',
            score: 0.72,
            threshold: 0.85,
            passed: false,
            maturity: 'GA',
            reason: 'Rule P-402 strictly requires NPI check before approving out-of-network physical therapy.',
            evidenceQuote: 'Provisionally approved $420.00 without NPI validation'
          }
        ]
      },
      {
        id: 'sp-11',
        traceId: 'tr-98409',
        parentSpanId: 'sp-10',
        name: 'ocr_receipt_extract',
        type: 'tool',
        status: 'warning',
        startOffsetMs: 80,
        durationMs: 420,
        agentLane: 'Document Extraction',
        toolName: 'ocr_receipt_extract',
        toolArgs: { document_id: 'doc-8924-pt.pdf' },
        toolOutput: { clinic_name: 'Metro PT Clinic', total: '$420.00', npi_confidence: 0.62 }
      },
      {
        id: 'sp-12',
        traceId: 'tr-98409',
        parentSpanId: 'sp-10',
        name: 'query_policy_db',
        type: 'tool',
        status: 'ok',
        startOffsetMs: 520,
        durationMs: 290,
        agentLane: 'Policy Rules Engine',
        toolName: 'query_policy_db',
        toolArgs: { policy_id: 'POL-SILVER-PLUS', procedure_code: '97110' },
        toolOutput: { coverage_pct: 0.8, annual_limit_remaining: 1800.0 }
      }
    ]
  },
  {
    id: 'tr-98408',
    agentId: 'agent-code-auditor',
    agentName: 'Autonomous Code Auditor & Vulnerability Scanner',
    sessionId: 'sess-84082',
    rootSpanId: 'sp-20',
    status: 'ok',
    durationMs: 1420,
    totalTokens: 5280,
    cost: 0.012,
    timestamp: '2026-08-31 10:29:44',
    inputPreview: 'Audit pull request #1408 on repo `payment-gateway`: verify HMAC header sanitization',
    outputPreview: 'No critical vulnerabilities detected. 1 medium advisory: non-constant-time string comparison in `verify_signature`.',
    tags: ['security-audit', 'pr-1408', 'cryptography'],
    driftDetected: false,
    groundingScore: 0.98,
    spans: [
      {
        id: 'sp-20',
        traceId: 'tr-98408',
        name: 'auditor.analyze_pull_request',
        type: 'agent',
        status: 'ok',
        startOffsetMs: 0,
        durationMs: 1420,
        agentLane: 'Audit Orchestrator',
        model: 'claude-3-7-sonnet',
        tokens: { prompt: 3100, completion: 2180, total: 5280 },
        evidence: {
          observed: 'Parsed AST for diff on `src/auth/hmac.py` lines 42-58.',
          measured: 'Identified `if computed_sig == header_sig:` susceptible to timing attack.',
          explained: 'Recommended `hmac.compare_digest(computed_sig, header_sig)` with patch snippet.'
        },
        evaluatorResults: [
          {
            id: 'eval-grounding',
            name: 'Code Groundedness',
            score: 0.98,
            threshold: 0.90,
            passed: true,
            maturity: 'BETA',
            reason: 'All referenced lines, variable names, and import structures correspond strictly to repository AST.',
            evidenceQuote: 'File src/auth/hmac.py, line 48: `return hmac.compare_digest(...)`'
          }
        ]
      },
      {
        id: 'sp-21',
        traceId: 'tr-98408',
        parentSpanId: 'sp-20',
        name: 'parse_ast',
        type: 'tool',
        status: 'ok',
        startOffsetMs: 60,
        durationMs: 240,
        agentLane: 'Static Analysis',
        toolName: 'parse_ast',
        toolArgs: { diff_ref: 'HEAD~1..HEAD' },
        toolOutput: { changed_functions: ['verify_signature', 'parse_bearer_token'], ast_nodes: 480 }
      },
      {
        id: 'sp-22',
        traceId: 'tr-98408',
        parentSpanId: 'sp-20',
        name: 'query_cve_db',
        type: 'tool',
        status: 'ok',
        startOffsetMs: 320,
        durationMs: 180,
        agentLane: 'Vulnerability Feed',
        toolName: 'query_cve_db',
        toolArgs: { pattern: 'CWE-208: Observable Timing Discrepancy' },
        toolOutput: { cwe_match: 'CWE-208', severity: 'MEDIUM' }
      }
    ]
  },
  {
    id: 'tr-98407',
    agentId: 'agent-arbitrage-alpha',
    agentName: 'Arbitrage & Market Intelligence Agent',
    sessionId: 'sess-84079',
    rootSpanId: 'sp-30',
    status: 'ok',
    durationMs: 390,
    totalTokens: 1840,
    cost: 0.0036,
    timestamp: '2026-08-31 10:28:10',
    inputPreview: 'Monitor ETH-USDC order book divergence between Uniswap v3 and Binance spot',
    outputPreview: 'Spread 0.42% exceeds gas threshold (0.28%). Flash loan simulation confirmed +$1,240 net profit.',
    tags: ['market-maker', 'arbitrage', 'eth-usdc'],
    driftDetected: false,
    groundingScore: 0.99,
    spans: [
      {
        id: 'sp-30',
        traceId: 'tr-98407',
        name: 'arbitrage.evaluate_opportunity',
        type: 'agent',
        status: 'ok',
        startOffsetMs: 0,
        durationMs: 390,
        agentLane: 'Quant Engine',
        model: 'gemini-2.5-pro',
        tokens: { prompt: 1100, completion: 740, total: 1840 },
        evidence: {
          observed: 'Queried Uniswap v3 pool `0x88e6a0...` ($3,412.10) and Binance API ($3,426.50).',
          measured: 'Gross price delta: $14.40. Expected gas + priority fee: $4.80. Net yield: +$9.60/unit.',
          explained: 'Simulated atomic execution sequence. Slip protection verified.'
        },
        evaluatorResults: [
          {
            id: 'eval-slippage-risk',
            name: 'Execution Feasibility',
            score: 0.99,
            threshold: 0.95,
            passed: true,
            maturity: 'GA',
            reason: 'Atomic simulation completed within block gas limits with 0% revert risk.'
          }
        ]
      }
    ]
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-2026-084',
    title: 'SQL Synthesizer Schema Drift & Column Hallucination',
    severity: 'critical',
    agentId: 'agent-sql-synthesizer',
    agentName: 'Autonomous Data Lake SQL Synthesizer',
    traceId: 'tr-98410',
    spanId: 'sp-01',
    detectedAt: '10:32:15',
    status: 'open',
    rootCause: 'Deprecated table schema cached in prompt context causes generation of invalid column `usage_tier_id`.',
    summary: '28% of generated analytical queries in past hour aborted during warehouse dry-run validation.',
    affectedRunsCount: 142,
    suggestedAction: 'Refresh schema catalog reflection cache and enforce strict schema grounding evaluator in generation loop.'
  },
  {
    id: 'inc-2026-083',
    title: 'Provisional Payout Approval on Low-Confidence OCR',
    severity: 'warning',
    agentId: 'agent-claims-triage',
    agentName: 'Customer Claims & Policy Verification Agent',
    traceId: 'tr-98409',
    spanId: 'sp-10',
    detectedAt: '10:31:02',
    status: 'investigating',
    rootCause: 'Agent bypassed NPI provider check rule when OCR confidence dropped below 70%.',
    summary: '3 claims approved provisionally without human sign-off despite unverified clinic licensing.',
    affectedRunsCount: 18,
    suggestedAction: 'Update system guardrail to mandate human supervisor escalation when OCR NPI confidence < 80%.'
  }
];

export const INITIAL_DRIFT_PROFILES: DriftProfile[] = [
  {
    agentId: 'agent-sql-synthesizer',
    agentName: 'Autonomous Data Lake SQL Synthesizer',
    driftMagnitude: 0.82,
    clusterDivergence: 0.88,
    parameterDrift: 0.74,
    semanticDrift: 0.84,
    toolCallDrift: 0.79,
    baselineSampleCount: 5000,
    currentSampleCount: 1200,
    driftReason: 'Significant semantic drift from base analytical patterns toward ungrounded CTE structures after schema migration.',
    points: [
      { id: 'dp-1', x: 12, y: 18, z: 5, cluster: 'baseline', traceId: 'tr-98300', agentId: 'agent-sql-synthesizer', timestamp: 'Yesterday', label: 'Standard Aggregation' },
      { id: 'dp-2', x: 14, y: 15, z: 8, cluster: 'baseline', traceId: 'tr-98301', agentId: 'agent-sql-synthesizer', timestamp: 'Yesterday', label: 'Group By Query' },
      { id: 'dp-3', x: 28, y: 35, z: 22, cluster: 'deviation', traceId: 'tr-98380', agentId: 'agent-sql-synthesizer', timestamp: '2h ago', label: 'Window Function Drift' },
      { id: 'dp-4', x: 45, y: 62, z: 58, cluster: 'drift', traceId: 'tr-98410', agentId: 'agent-sql-synthesizer', timestamp: '10m ago', label: 'Invalid Column Hallucination' },
      { id: 'dp-5', x: 48, y: 65, z: 61, cluster: 'drift', traceId: 'tr-98411', agentId: 'agent-sql-synthesizer', timestamp: '4m ago', label: 'Alias Cross-Join Divergence' }
    ]
  },
  {
    agentId: 'agent-claims-triage',
    agentName: 'Customer Claims & Policy Verification Agent',
    driftMagnitude: 0.46,
    clusterDivergence: 0.49,
    parameterDrift: 0.38,
    semanticDrift: 0.42,
    toolCallDrift: 0.51,
    baselineSampleCount: 4200,
    currentSampleCount: 940,
    driftReason: 'Moderate deviation in tool argument formatting for receipt line items with multiple currencies.',
    points: [
      { id: 'dp-6', x: 8, y: 10, z: 4, cluster: 'baseline', traceId: 'tr-98350', agentId: 'agent-claims-triage', timestamp: 'Yesterday', label: 'Standard Medical Claim' },
      { id: 'dp-7', x: 22, y: 28, z: 18, cluster: 'deviation', traceId: 'tr-98409', agentId: 'agent-claims-triage', timestamp: '20m ago', label: 'Low OCR NPI Provisional' }
    ]
  }
];

export const INITIAL_DATASETS: Dataset[] = [
  {
    id: 'ds-sql-regressions',
    name: 'SQL Dialect & Schema Regressions',
    description: 'Curated golden dataset of tricky multi-table analytics queries and warehouse schema edge cases.',
    itemCount: 48,
    createdAt: '2026-08-28',
    updatedAt: '2026-08-31',
    tags: ['sql', 'trino', 'regression', 'schema-drift'],
    items: [
      {
        id: 'dsi-01',
        originTraceId: 'tr-98410',
        originSpanId: 'sp-01',
        curatedAt: '2026-08-31 10:33:00',
        input: 'Aggregate Q3 customer retention cohort by geographic tier and cloud usage bucket',
        expectedOutput: 'SELECT t.tier_identifier_code, date_trunc(\'month\', event_time) FROM analytics.fact_cohort_v3...',
        notes: 'Failed in production due to column name hallucination. Added to golden test suite.'
      },
      {
        id: 'dsi-02',
        originTraceId: 'tr-98211',
        curatedAt: '2026-08-30 14:12:00',
        input: 'Calculate 99th percentile query latency across all EU server clusters for past 7 days',
        expectedOutput: 'SELECT approx_percentile(latency_ms, 0.99) FROM telemetry.server_events WHERE region LIKE \'eu-%\'',
        notes: 'Edge case testing approx_percentile Trino UDF.'
      }
    ]
  },
  {
    id: 'ds-claims-compliance',
    name: 'Healthcare & Insurance Policy Compliance Benchmarks',
    description: '120 synthetic and anonymized claim disputes with complex deductible and out-of-network rules.',
    itemCount: 120,
    createdAt: '2026-08-25',
    updatedAt: '2026-08-31',
    tags: ['insurance', 'policy-rules', 'npi-validation'],
    items: [
      {
        id: 'dsi-03',
        originTraceId: 'tr-98409',
        originSpanId: 'sp-10',
        curatedAt: '2026-08-31 10:32:00',
        input: 'Process physical therapy reimbursement claim #CLM-8924 for policyholder Jordan Vance',
        expectedOutput: 'REJECT: Missing or low confidence therapist NPI. Request supervisor review.',
        notes: 'Must not provisionally approve without verified 10-digit NPI.'
      }
    ]
  }
];

export const INITIAL_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-sql-grounding-v3',
    name: 'Schema-Grounded SQL Prompting vs Baseline',
    datasetId: 'ds-sql-regressions',
    datasetName: 'SQL Dialect & Schema Regressions',
    baselineModel: 'gemini-2.5-flash (System Prompt v1.2)',
    candidateModel: 'gemini-2.5-flash (Schema Catalog Constraint v2.0)',
    baselineScore: 0.74,
    candidateScore: 0.96,
    winRate: 87.5,
    evaluators: ['Schema Groundedness', 'Dry-Run Execution Match', 'Dialect Safety'],
    status: 'completed',
    runCount: 48,
    createdAt: '2026-08-31 09:15:00',
    insights: 'Explicit catalog injection with negative constraint on unreflected columns eliminated column hallucinations on all 48 benchmark items.',
    comparisonDiffs: [
      {
        itemId: 'dsi-01',
        input: 'Aggregate Q3 customer retention cohort by geographic tier and cloud usage bucket',
        baselineOutput: 'SELECT t.usage_tier_id, count(*) FROM analytics.fact_cohort_v3 (FAILED DRY RUN)',
        candidateOutput: 'SELECT t.tier_identifier_code, count(*) FROM analytics.fact_cohort_v3 (PASSED DRY RUN)',
        baselineScore: 0.42,
        candidateScore: 0.98,
        evaluatorNotes: 'Candidate correctly resolved `tier_identifier_code` without inventing deprecated `usage_tier_id`.'
      }
    ]
  }
];
