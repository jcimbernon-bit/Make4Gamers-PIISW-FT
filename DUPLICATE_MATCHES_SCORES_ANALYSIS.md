# 🚨 Duplicate Matches & Scores Issue - Root Cause Analysis

**Date**: May 5, 2026  
**Status**: ✅ Codebase Search Complete  
**Finding**: Critical SDK functions are missing from implementation

---

## Executive Summary

The duplicate match/score issue appears to be caused by **incomplete SDK implementation**. The API package exports only `createMatch()` but is missing three critical functions (`endMatch`, `submitEloResult`, `submitMatchMovement`) that are documented as required but never implemented.

---

## 🔍 Key Findings

### 1. Missing SDK Functions

The documentation expects these functions from `m4g-sdk`:

| Function | Status | Location | Purpose |
|----------|--------|----------|---------|
| `createMatch()` | ✅ IMPLEMENTED | [packages/api/src/services/matches.service.ts](packages/api/src/services/matches.service.ts#L11) | Create a new match record |
| `submitEloResult()` | ❌ **MISSING** | - | Calculate and save ELO rating changes |
| `endMatch()` | ❌ **MISSING** | - | Close/finish the match in database |
| `submitMatchMovement()` | ❌ **MISSING** | - | Record individual player moves/turns |

**Problem**: Only `createMatch` exists. The other three are documented but never implemented.

---

## 📊 Detailed Code Analysis

### A. Match Creation (WORKS)

**File**: [packages/api/src/repositories/matches.repository.ts](packages/api/src/repositories/matches.repository.ts)

```typescript
export async function insertMatch(
  client: SupabaseClient,
  input: { gameId: string; userId: string; sessionTimerSeconds?: number | null },
): Promise<string> {
  const basePayload = {
    game_id: input.gameId,
    player_1: input.userId,
    status: "in_progress",
  };

  // ... attempts to insert with or without timer column ...
  
  const { data, error } = await client
    .from("matches")
    .insert(payload)
    .select("id")
    .single();
    
  return data.id as string;
}
```

**Called from**: [web/src/features/gameplay/services/createMatch.service.ts](web/src/features/gameplay/services/createMatch.service.ts)

```typescript
import { createMatch as createMatchFromApi } from "../../../../../packages/api/src";

export async function createMatch({ gameId, sessionTimerSeconds }: CreateMatchInput): Promise<string> {
  return createMatchFromApi(supabase, { gameId, sessionTimerSeconds });
}
```

### B. Match Ending (MISSING)

**Expected in API but NOT FOUND**:
- No function to update matches table with `status = 'ended'`
- No function to record match results/winners
- Documentation references `endMatch()` from `m4g-sdk` but function doesn't exist

### C. Score Recording (MISSING)

**Actual Score Functions Found**:

1. **Reading Scores** (WORKS) - [packages/api/src/repositories/scores.repository.ts](packages/api/src/repositories/scores.repository.ts)
```typescript
export async function findTopUserGameScore(
  client: SupabaseClient,
  userId: string,
  gameId: string,
): Promise<number | null> {
  const { data, error } = await client
    .from("scores")
    .select("score")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .order("score", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return null;
  return data[0].score as number;
}
```

2. **Points Recording** (PARTIALLY WORKS) - [packages/api/src/repositories/ranking.repository.ts](packages/api/src/repositories/ranking.repository.ts)
```typescript
export function insertRankingScoreEvent(
  client: SupabaseClient,
  input: {
    userId: string;
    points: number;
    milestoneName: string;
    createdAt: string;
  },
) {
  return client.from("puntuaciones").insert([  // <-- WRONG TABLE!
    {
      user_id: input.userId,
      cantidad: input.points,
      hito: input.milestoneName,
      creado_en: input.createdAt,
    },
  ]);
}
```

**CRITICAL ISSUE**: Points are being inserted into `puntuaciones` table, NOT the `scores` table!

3. **Missing ELO Calculation** (NOT FOUND)
- No function to calculate ELO deltas
- No function to update player rankings
- Documentation references `submitEloResult()` but it doesn't exist

---

## 📋 Database Tables Involved

### Matches Table
- `id` (PK)
- `game_id` (FK)
- `player_1` (user_id)
- `player_2` (user_id, nullable)
- `status` (in_progress, ended, abandoned)
- `created_at`
- `updated_at`
- `session_timer_seconds` (optional)

**Problem**: Matches can stay in `in_progress` status indefinitely because `endMatch()` doesn't exist to update them.

### Scores Table
- `id` (PK)
- `user_id` (FK)
- `game_id` (FK)
- `score` (integer)
- `created_at`

**Problem**: No code anywhere inserts into this table! The `submitEloResult()` function that should do this is missing.

### Puntuaciones Table (Alternative Points Table?)
- `id` (PK)
- `user_id` (FK)
- `cantidad` (points)
- `hito` (milestone name)
- `creado_en` (created_at)

**Issue**: This appears to be used instead of the `scores` table, causing confusion and potential duplication.

---

## 🎯 Root Cause of Duplicates

### Scenario 1: Multiple Match Creation Calls
```
1. Developer A starts a match → createMatch() called → Match created (in_progress)
2. Match doesn't end (no endMatch function) → stays in_progress
3. Developer A tries again → createMatch() called again
4. Second match created with same player/game
5. Result: 2+ matches with same game_id/player_1
```

### Scenario 2: Score Duplication via Trigger
If there's a Supabase trigger that auto-creates scores when matches are created:
```
1. createMatch() creates match record
2. Trigger fires: INSERT INTO scores
3. But if createMatch is called multiple times → multiple score records
```

### Scenario 3: Race Condition
If multiple players call `createMatch()` simultaneously before host-only check:
```
1. Player 1 calls createMatch() → Match A created
2. Player 2 calls createMatch() (no host validation)
3. Player 2 gets new Match B created
4. System confused about which match to use
```

---

## 🔴 Critical Issues

### 1. **Missing Implementation**
- ❌ `submitEloResult()` - needed to record ELO changes
- ❌ `endMatch()` - needed to close matches
- ❌ `submitMatchMovement()` - needed to record turns
- ⚠️ No score insertion function at all for `scores` table

### 2. **No Match Termination**
Matches created with `status = 'in_progress'` have no way to become `'ended'`

### 3. **Wrong Score Table**
Points go to `puntuaciones` but system queries `scores` table

### 4. **No Duplicate Prevention**
- No unique constraint preventing same user from creating multiple matches
- No host validation on client before calling createMatch
- No idempotency key to prevent retry duplicates

### 5. **No RLS Protection**
Looking at code, no evidence of Row-Level Security policies that would prevent multiple insertions

---

## 📄 Documentation vs Implementation Gap

**Documentation states**:
```typescript
import { createMatch, submitEloResult, endMatch, submitMatchMovement } from 'm4g-sdk';
```

**Actual exports from @m4g/api**:
```typescript
// packages/api/src/index.ts
export { createMatch, getActiveMatch } from "./services/matches.service";
export { getUserGameScore } from "./services/scores.service";
export { registrarPuntos } from "./services/ranking.service";
// ... NO submitEloResult, endMatch, submitMatchMovement exported
```

**npm Package Status**:
- `m4g-sdk` is NOT in [packages/api/package.json](packages/api/package.json)
- `m4g-sdk` is NOT in [web/package.json](web/package.json)
- `m4g-sdk` is NOT in [mobile/package.json](mobile/package.json)

---

## 📁 Files Related to Match/Score Logic

### API Services & Repositories
1. [packages/api/src/services/matches.service.ts](packages/api/src/services/matches.service.ts) - Match service (only createMatch)
2. [packages/api/src/repositories/matches.repository.ts](packages/api/src/repositories/matches.repository.ts) - Match DB layer
3. [packages/api/src/services/scores.service.ts](packages/api/src/services/scores.service.ts) - Scores service (only reads)
4. [packages/api/src/repositories/scores.repository.ts](packages/api/src/repositories/scores.repository.ts) - Scores DB layer (only reads)
5. [packages/api/src/services/ranking.service.ts](packages/api/src/services/ranking.service.ts) - Ranking service (wrong table)
6. [packages/api/src/repositories/ranking.repository.ts](packages/api/src/repositories/ranking.repository.ts) - Inserts to puntuaciones

### Web Client
1. [web/src/features/gameplay/services/createMatch.service.ts](web/src/features/gameplay/services/createMatch.service.ts) - Match creation wrapper
2. [web/src/features/gameplay/hooks/useActiveMatch.ts](web/src/features/gameplay/hooks/useActiveMatch.ts) - Hook to fetch active matches
3. [web/src/features/gameplay/hooks/useGameScore.ts](web/src/features/gameplay/hooks/useGameScore.ts) - Hook to fetch game score

### Documentation (Reference Only)
1. [web/src/features/developer/content/developer-guidelines/09-sdk-instalacion.md](web/src/features/developer/content/developer-guidelines/09-sdk-instalacion.md) - Lists functions that don't exist
2. [web/src/features/developer/content/developer-guidelines/08-sistema-de-elo-ranking-y-progresion.md](web/src/features/developer/content/developer-guidelines/08-sistema-de-elo-ranking-y-progresion.md) - Describes submitEloResult but no implementation
3. [web/src/features/developer/content/developer-guidelines/04-sistema-de-configuracion-de-partidas.md](web/src/features/developer/content/developer-guidelines/04-sistema-de-configuracion-de-partidas.md) - Describes endMatch but no implementation
4. [web/src/features/developer/content/developer-guidelines/09b-sdk-flujo-completo.md](web/src/features/developer/content/developer-guidelines/09b-sdk-flujo-completo.md) - Complete flow example (not implemented)

---

## ✅ Recommendations to Fix

### Phase 1: Implement Missing Functions
1. Create `endMatch()` function to update match status
2. Create `submitEloResult()` function to calculate and save ELO changes
3. Create `submitMatchMovement()` function to record game moves
4. Export all three from @m4g/api

### Phase 2: Fix Score Recording
1. Create function to insert into `scores` table (not `puntuaciones`)
2. Clarify purpose of `puntuaciones` table vs `scores` table
3. Update `registrarPuntos()` to use correct table

### Phase 3: Add Duplicate Prevention
1. Add unique constraint: `(user_id, game_id, status='in_progress')`
2. Add idempotency keys for retry safety
3. Add host validation before allowing match creation
4. Add RLS policies to prevent unauthorized insertions

### Phase 4: Database Triggers (if applicable)
1. Check if any Supabase triggers exist that might be causing duplicates
2. Verify trigger logic doesn't fire multiple times

---

## 🔗 Related Issues

- Matches stuck in `in_progress` status
- Players seeing multiple "in progress" matches for same game
- ELO/ranking never updates (submitEloResult missing)
- Scores in wrong table (puntuaciones instead of scores)
- No way to complete/end a match through API

---

## 📞 Questions for Investigation

1. Is `m4g-sdk` a planned future package?
2. Is `puntuaciones` table intentional or a leftover?
3. Are there Supabase triggers/functions defined that should prevent duplicates?
4. What's the intended flow for match completion?
5. Should duplicate match prevention be in API or enforced at Supabase level?

