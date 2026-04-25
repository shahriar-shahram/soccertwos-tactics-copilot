#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <run_id> <hours> <trainer_config> [env_path]"
  echo "Example (Unity Editor): $0 soccertwos_poca_baseline_s1 6 training/configs/poca_baseline.yaml"
  echo "Example (built executable): $0 soccertwos_poca_baseline_s1 6 training/configs/poca_baseline.yaml /absolute/path/to/SoccerTwos.x86_64"
  exit 1
fi

RUN_ID="$1"
HOURS="$2"
TRAINER_CONFIG_INPUT="$3"
ENV_PATH_INPUT="${4:-}"

TACTICS_ROOT="$HOME/PycharmProjects/azure-soccertwos-tactics-copilot"
MLAGENTS_ROOT="$HOME/PycharmProjects/ml-agents"
MLAGENTS_VENV="$MLAGENTS_ROOT/.venv"
LOG_DIR="$MLAGENTS_ROOT/training_logs"

mkdir -p "$LOG_DIR"

if [[ "$TRAINER_CONFIG_INPUT" = /* ]]; then
  TRAINER_CONFIG="$TRAINER_CONFIG_INPUT"
else
  TRAINER_CONFIG="$TACTICS_ROOT/$TRAINER_CONFIG_INPUT"
fi

if [ ! -f "$TRAINER_CONFIG" ]; then
  echo "Trainer config not found:"
  echo "  $TRAINER_CONFIG"
  exit 1
fi

ENV_ARGS=()
if [ -n "$ENV_PATH_INPUT" ]; then
  if [[ "$ENV_PATH_INPUT" = /* ]]; then
    ENV_PATH="$ENV_PATH_INPUT"
  else
    ENV_PATH="$TACTICS_ROOT/$ENV_PATH_INPUT"
  fi

  if [ ! -f "$ENV_PATH" ]; then
    echo "Environment executable not found:"
    echo "  $ENV_PATH"
    exit 1
  fi

  ENV_ARGS+=(--env "$ENV_PATH" --no-graphics)
fi

echo "Starting run: $RUN_ID"
echo "Hours: $HOURS"
echo "Trainer config: $TRAINER_CONFIG"
if [ "${#ENV_ARGS[@]}" -gt 0 ]; then
  echo "Mode: built executable"
  echo "Environment: $ENV_PATH"
else
  echo "Mode: Unity Editor connection"
fi
echo "Using ML-Agents env: $MLAGENTS_VENV"
echo "Logs: $LOG_DIR/${RUN_ID}.log"

cd "$MLAGENTS_ROOT"
source "$MLAGENTS_VENV/bin/activate"

timeout "${HOURS}h" "$MLAGENTS_VENV/bin/mlagents-learn" "$TRAINER_CONFIG" \
  --run-id "$RUN_ID" \
  --torch-device cuda \
  "${ENV_ARGS[@]}" \
  2>&1 | tee "$LOG_DIR/${RUN_ID}.log"

EXIT_CODE=${PIPESTATUS[0]}

if [ "$EXIT_CODE" -eq 124 ]; then
  echo "Run $RUN_ID stopped automatically after ${HOURS} hours."
else
  echo "Run $RUN_ID exited with code $EXIT_CODE."
fi
