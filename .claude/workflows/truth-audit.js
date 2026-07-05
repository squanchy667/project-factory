export const meta = {
  name: 'truth-audit',
  description: 'Read-only project truth audit: census → 5-dimension parallel gather → adversarial verify (3-lens panel for Critical, single refuter for Major) → structured reports for Master synthesis. Deletes nothing; recommends only.',
  phases: [
    { title: 'Census',  detail: 'snapshot surface area — docs/modules/tables/migrations/test baseline' },
    { title: 'Gather',  detail: '5 dimensions (docs/code/sources/schema/tests) read in parallel' },
    { title: 'Verify',  detail: '3-lens panel for Critical findings, single refuter for Major + dead/superseded candidates' },
  ],
}

// ── parameters (args overrides; DaraReports defaults so it runs with no args) ──
const A      = (typeof args === 'object' && args) ? args : {}
const REPO   = A.repo     || '/Users/ofek/Projects/Claude/DaraReports/dara-v2'
const DOCS   = A.docsRoot || '/Users/ofek/Projects/Claude/DaraReports'
const DBURL  = A.db       || 'postgresql://dara:dara@localhost:5432/dara_v2'
const PGPW   = A.pg       || 'dara'
const SCOPE  = A.scope    || 'Hadera-only (settlement 6500; POC gush 10049)'
const CANON  = A.counts   || 'deals 1603 / with_developer 1256 / ambiguous 343 / tenders 43 / projects 32'
const SUSPECTS = A.suspects || [
  'assetId-based dedup (per-fetch/positional) vs canonical stable key parcelNum+dealDate+dealAmount (uq_deals_stable_key, migration 0013)',
  'ATTRIBUTION MODULE CLUSTER (#1 layered-not-replaced suspect): presentation_resolver, attribution_registry/attribution_resolver, developer_aliases, developer_extractor, party_resolver, project_resolver, cross_linker, takanon_companies — which is the SINGLE canonical L3 attribution path, which are overlapping/dead?',
  'two tabanow fetch paths: collectors/taba_plans.py vs processors/itur_tabot_harvest.py vs collectors/itur_tabot_data.py — same job or competing?',
  'verify the gap-loop doc §5 reuse-map: do floors_parser.py, floors_harvest.py, project_resolver.py, party_resolver.py, tables fetch_attempts/extracted_facts/contractors actually exist + wired + have rows?',
  'floor grain contradiction: Lane B ships floor_total at PARCEL grain (10036-476->8) but gap-loop doc says per-parcel floor_total is structurally wrong (per-תא שטח: 24/6/15/8 coexist)',
  'units modeled as scalar vs the doc-intended triple (existing/added/total)',
  'dead MAYA collector code after the MAGNA pivot',
  'source-rationalization drop-candidates S13/S14/S15/code_lookups vs the Phase-3.5 15/15 gate that needs them',
  'stale counts in docs (old 1592 deals / 1248 with-dev) vs canonical',
].join('; ')

const DIMS = A.dims || [
  { key:'D1-docs',    brief:'Inventory ALL docs: root *.md + every docs repo (dara-v2-docs, dara-v2-ui-docs, dara-reports-docs). Extract every count/status/"built"/"dropped"/"source X feeds Y"/scope/migration-head claim into a claims table; tag each doc-verifiable vs needs-code/DB/test. Find doc-vs-doc contradictions and the duplicate-family supersession map (e.g. the 7 Phase-4 docs, 4+ wave3, 3 Phase-3.5).' },
  { key:'D2-code',    brief:'Build the import/reference graph over the repo package. List modules with NO importer (dead) and competing implementations doing the same job. Cite file:line for every claim. Confirm/refute each known suspect.' },
  { key:'D3-sources', brief:'Source matrix: for each data source (and each numbered S-source) — wired in code? populates which table? row count? KEEP vs drop per source-rationalization.md? Adjudicate any drop-vs-gate conflict against the ACTUAL gate test + wiring, not the decision doc.' },
  { key:'D4-schema',  brief:'For every DB table: row count · has-writer (insert path in code) · has-reader (select/query/presentation) · referenced by the build/ETL? Flag orphan columns (no reader/writer), superseded structures (e.g. old uniqueness replaced by a newer constraint; abandoned-pivot tables), zero-reader tables. Check migration chain health (single head, linear).' },
  { key:'D5-tests',   brief:'What the suite actually asserts. Which tests pin the CANONICAL numbers vs STALE ones. Root-cause any baseline flakes (separate real reds from pollution/timing). Find skip/xfail/integration-gated tests, tests that do not actually assert anything meaningful, and untested modules (cross-ref dead code). Ground truth = a clean-base run.' },
]

const ENV = `Repo: ${REPO}. Docs/state root: ${DOCS}. DB: ${DBURL} (PGPASSWORD=${PGPW}). Scope: ${SCOPE}.`
const PRINCIPLE = 'GROUND TRUTH = code + live DB + passing tests. Docs are CLAIMS to verify against that — never trust a doc on its own.'

// ── schemas ──
const CENSUS = { type:'object', required:['summary'], properties:{
  summary:{type:'string'}, docCount:{type:'integer'}, docFamilies:{type:'string'},
  moduleCount:{type:'integer'}, tableCount:{type:'integer'}, migrationHead:{type:'string'},
  testBaseline:{type:'string'} } }

const REPORT = { type:'object', required:['dimension','groundTruth','findings'], properties:{
  dimension:{type:'string'},
  groundTruth:{type:'string'},                       // the verified reality for this artifact type
  contradictions:{type:'array', items:{type:'object', required:['claim','reality','severity'], properties:{
    claim:{type:'string'}, where:{type:'string'}, reality:{type:'string'}, evidence:{type:'string'},
    severity:{enum:['Critical','Major','Minor']}, recommendation:{type:'string'} }}},
  layered:{type:'array', items:{type:'object', required:['item','evidence'], properties:{
    item:{type:'string'}, evidence:{type:'string'}, recommendation:{type:'string'} }}},  // dead/competing/superseded
  findings:{type:'string'} } }

const VERDICT = { type:'object', required:['holds'], properties:{
  holds:{type:'boolean'}, evidence:{type:'string'}, note:{type:'string'} } }

// ── Census ──
phase('Census')
const census = await agent(
  `READ-ONLY surface-area census — modify nothing. ${ENV}
   Report the denominator the audit measures against: total doc count + duplicate doc families;
   module count; table count (+ list); current migration head; test baseline (pass/fail counts +
   identify known flakes vs real reds). ${PRINCIPLE}`,
  { label:'census', schema: CENSUS })
log(`census — docs:${census.docCount||'?'} modules:${census.moduleCount||'?'} tables:${census.tableCount||'?'} head:${census.migrationHead||'?'}`)

// ── Gather (parallel, read-only) ──
phase('Gather')
const reports = (await parallel(DIMS.map(d => () =>
  agent(
    `READ-ONLY audit — modify NO file. ${d.brief}
     ${ENV}
     Principle: ${PRINCIPLE}
     Known suspects (verify, do NOT assume true): ${SUSPECTS}
     Canonical counts to check claims against: ${CANON}
     Return: verified groundTruth (the reality for your artifact type), contradictions
     (each: claim · where · reality · evidence · severity[Critical|Major|Minor] · recommendation),
     and layered/dead/superseded candidates (each with file:line or SQL evidence + an ADVISORY
     recommendation — never propose to delete here, just flag).`,
    { label:d.key, phase:'Gather', schema:REPORT, agentType:'Explore' }
  )))).filter(Boolean)

const allC    = reports.flatMap(r => (r.contradictions||[]).map(c => ({...c, dim:r.dimension})))
const critical= allC.filter(c => c.severity === 'Critical')
const major   = allC.filter(c => c.severity === 'Major')
const layered = reports.flatMap(r => (r.layered||[]).map(x => ({...x, dim:r.dimension})))
log(`gathered — contradictions: ${critical.length} Critical / ${major.length} Major / ${allC.length-critical.length-major.length} Minor · layered candidates: ${layered.length}`)

// ── Verify ──
phase('Verify')
const LENSES = [
  'CORRECTNESS — is the asserted reality factually right when you re-derive it?',
  'SOURCE-WIRING — does the data/control flow actually connect (or not) the way the finding claims?',
  'REPRODUCE — re-run the exact command / SQL / test yourself and report what you observe.',
]

// 3-lens panel for every Critical finding — majority of 'holds' ⇒ Confirmed
const verifiedCritical = await parallel(critical.map(c => () =>
  parallel(LENSES.map((lens, i) => () =>
    agent(
      `READ-ONLY. Judge INDEPENDENTLY via this lens whether the finding HOLDS. Default holds=false if unsure.
       Lens: ${lens}
       Finding (${c.dim}, ${c.severity}): "${c.claim}" — at ${c.where||'(unspecified)'}.
       Asserted reality: "${c.reality}". Evidence cited: ${c.evidence||'(none)'}.
       Re-derive from raw evidence in ${REPO} / DB ${DBURL}. ${PRINCIPLE}`,
      { label:`verifyC:${c.dim}:${i}`, phase:'Verify', schema: VERDICT }
    )))
  .then(vs => {
    const ok = vs.filter(Boolean)
    const yes = ok.filter(v => v.holds).length
    return { ...c, confidence: yes >= 2 ? 'Confirmed' : 'Refuted', votes:`${yes}/${ok.length}`,
             verifyEvidence: ok.map(v => v.evidence).filter(Boolean).join(' || ') }
  })))

// single independent refuter for Major contradictions + layered/dead candidates
const singles = [
  ...major.map(c => ({ ...c, kind:'contradiction' })),
  ...layered.map(x => ({ dim:x.dim, claim:x.item, where:'', reality:'(dead/competing/superseded candidate)', evidence:x.evidence, severity:'Major', kind:'layered' })),
]
const verifiedMajor = await parallel(singles.map(c => () =>
  agent(
    `READ-ONLY. Try to REFUTE this finding from raw evidence; default holds=false if unsure.
     Finding (${c.dim}, ${c.kind}): "${c.claim}" ${c.where?`at ${c.where}`:''}.
     Asserted reality: "${c.reality}". Evidence cited: ${c.evidence||'(none)'}.
     Re-derive in ${REPO} / DB ${DBURL}. ${PRINCIPLE}`,
    { label:`verifyM:${c.dim}`, phase:'Verify', schema: VERDICT }
  ).then(v => ({ ...c, confidence: (v && v.holds) ? 'Confirmed' : 'Refuted', verifyEvidence: v ? v.evidence : '' }))))

return {
  census,
  reports,
  verifiedCritical,
  verifiedMajor,
  note: 'Master synthesizes PROJECT_TRUTH_REPORT_<date>.md from these. Confidence=Confirmed means it survived verification. READ-ONLY run — nothing was changed; layered/dead items are advisory only.',
}
