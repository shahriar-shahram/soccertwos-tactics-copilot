# SoccerTwos Policy Evaluation

This folder contains the standardized evaluation results for the trained SoccerTwos POCA policies used in the SoccerTwos Tactics Copilot project.

The goal of this evaluation is to compare trained multi-agent soccer policies under a repeatable benchmark and then use the results as grounded evidence for the analysis and copilot interface.

---

## Trained Policies

Three POCA self-play policies were trained for this evaluation:

| Policy ID | Description | Training Steps | Device | Final Training ELO |
|---|---|---:|---|---:|
| `soccertwos_poca_baseline_s1` | Baseline self-play policy | 20M | CPU | 1485.941 |
| `soccertwos_poca_aggressive_s1` | Aggressive transition-style variant | 20M | CPU | 1284.072 |
| `soccertwos_poca_safe_s1` | Defensive / safer-recovery variant | 20M | CPU | 1692.464 |

The final ONNX policy artifacts are tracked under:

```text
training/results/
```

Each policy folder includes the selected final ONNX model, training configuration, and run logs.

---

## Evaluation Protocol

The original SoccerTwos environment ends an episode after a single goal. For evaluation, the environment controller was modified so each benchmark match is more informative:

- Each match runs until one side reaches **10 goals**.
- If neither side reaches 10 goals, the match ends at **5000 environment steps**.
- If timeout occurs:
  - the higher-score team wins;
  - equal score is recorded as a draw.
- Each matchup direction is evaluated over **50 matches**.
- Cross-policy comparisons are evaluated in both side assignments:
  - Policy A as Blue vs Policy B as Purple;
  - Policy B as Blue vs Policy A as Purple.

This side-balanced design is important because Blue/Purple assignment can introduce bias through spawn positions, observation ordering, team encoding, or other environment details.

Raw CSV logs are stored in:

```text
evaluation/results/csv/
```

Per-matchup summaries are stored in:

```text
evaluation/results/summaries/
```

---

## Self-Play Results

Self-play evaluates whether each policy behaves symmetrically when both teams use the same trained model.

| Matchup | Matches | Blue Wins | Purple Wins | Draws | Avg Goals Blue | Avg Goals Purple | Avg Goal Diff |
|---|---:|---:|---:|---:|---:|---:|---:|
| Baseline vs Baseline | 50 | 25 | 25 | 0 | 7.78 | 7.74 | +0.04 |
| Aggressive vs Aggressive | 50 | 15 | 32 | 3 | 7.02 | 8.84 | -1.82 |
| Safe vs Safe | 50 | 28 | 22 | 0 | 8.46 | 7.48 | +0.98 |

### Self-Play Discussion

The baseline policy is the most side-symmetric in self-play, with an exactly balanced 25-25 win split and nearly identical average goals for both sides.

The aggressive policy shows a strong side asymmetry in self-play, with Purple winning substantially more often than Blue. This is why side-balanced cross-policy evaluation is necessary before making claims about policy quality.

The safe policy shows a moderate Blue-side advantage but is less asymmetric than the aggressive self-play result.

---

## Side-Balanced Cross-Policy Results

Each pairwise comparison combines both side assignments, giving 100 total matches per policy pair.

| Policy A | Policy B | Total Matches | A Wins | B Wins | Draws | A Win Rate | B Win Rate | Avg Goals A | Avg Goals B | Avg Goal Diff A-B |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Aggressive S1 | Baseline S1 | 100 | 62 | 35 | 3 | 0.62 | 0.35 | 8.76 | 7.63 | +1.13 |
| Baseline S1 | Safe S1 | 100 | 61 | 37 | 2 | 0.61 | 0.37 | 8.78 | 7.70 | +1.08 |
| Aggressive S1 | Safe S1 | 100 | 72 | 26 | 2 | 0.72 | 0.26 | 9.12 | 6.71 | +2.41 |

---

## Interpretation

### 1. Aggressive S1 is the strongest policy in this evaluation set

The aggressive policy beats both alternatives after side balancing:

- vs Baseline: 62 wins, 35 losses, 3 draws
- vs Safe: 72 wins, 26 losses, 2 draws

This suggests the aggressive variant creates more effective scoring pressure under the current SoccerTwos evaluation protocol.

### 2. Baseline S1 is stronger than Safe S1

The baseline policy beats the safe policy in side-balanced evaluation:

- Baseline: 61 wins
- Safe: 37 wins
- Draws: 2

Although the safe policy had the highest final training ELO, cross-policy testing shows that it does not outperform the baseline in direct competition.

### 3. Training ELO alone is not sufficient

The final training ELO ranking was:

1. Safe S1
2. Baseline S1
3. Aggressive S1

But the side-balanced evaluation ranking is:

1. Aggressive S1
2. Baseline S1
3. Safe S1

This is an important result. It shows why policy evaluation should include direct controlled matchups rather than relying only on final self-play training ELO.

### 4. Side-balanced evaluation is necessary

The aggressive self-play result showed strong Purple-side advantage. If only one side assignment were tested, the conclusions could be misleading.

By running both directions for every policy pair, the benchmark reduces the risk that Blue/Purple assignment effects dominate the policy comparison.

---

## Final Ranking

Based on the side-balanced cross-policy results:

| Rank | Policy | Evidence |
|---:|---|---|
| 1 | `soccertwos_poca_aggressive_s1` | Beats both baseline and safe policies in side-balanced pairwise evaluation |
| 2 | `soccertwos_poca_baseline_s1` | Beats safe policy but loses to aggressive policy |
| 3 | `soccertwos_poca_safe_s1` | Loses to both aggressive and baseline policies |

---

## Files Included

Important evaluation files:

```text
evaluation/results/csv/baseline_s1_vs_baseline_s1.csv
evaluation/results/csv/aggressive_s1_vs_aggressive_s1.csv
evaluation/results/csv/safe_s1_vs_safe_s1.csv
evaluation/results/csv/baseline_s1_vs_aggressive_s1.csv
evaluation/results/csv/aggressive_s1_vs_baseline_s1.csv
evaluation/results/csv/baseline_s1_vs_safe_s1.csv
evaluation/results/csv/safe_s1_vs_baseline_s1.csv
evaluation/results/csv/aggressive_s1_vs_safe_s1.csv
evaluation/results/csv/safe_s1_vs_aggressive_s1.csv
```

Important summary files:

```text
evaluation/results/summaries/baseline_s1_vs_baseline_s1.json
evaluation/results/summaries/aggressive_s1_vs_aggressive_s1.json
evaluation/results/summaries/safe_s1_vs_safe_s1.json
evaluation/results/summaries/side_balanced_policy_comparison.csv
evaluation/results/summaries/side_balanced_policy_comparison.json
```

---

## Limitations

These results are useful for portfolio and system demonstration purposes, but they should not be treated as final scientific claims.

Main limitations:

- Only one training seed per policy variant was evaluated.
- The evaluation uses one SoccerTwos environment configuration.
- Results may change with different random seeds, longer training, or modified reward functions.
- Event-level tactical labels such as pressure, recovery, double-commit, and counterattack are not yet automatically extracted.

Future improvements should include:

- multiple seeds per policy variant;
- confidence intervals over match outcomes;
- automated tactical event extraction;
- replay selection for qualitative analysis;
- app-level visualization of side-balanced results.

---

## Key Takeaway

The evaluation pipeline now supports reproducible, CSV-backed, side-balanced policy comparison. Under this protocol, the aggressive policy is the strongest of the three trained policies, followed by the baseline policy, with the safe policy ranking third.
