#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <run_id> <trainer_config> [timeout_hours] [env_path] [run_mode]"
  exit 1
fi

RUN_ID="$1"
TRAINER_CONFIG_INPUT="$2"
TIMEOUT_HOURS="${3:-24}"
ENV_PATH_INPUT="${4:-}"
RUN_MODE="${5:-fresh}"

TACTICS_ROOT="$HOME/PycharmProjects/azure-soccertwos-tactics-copilot"
MLAGENTS_ROOT="$HOME/PycharmProjects/ml-agents"
MLAGENTS_VENV="$MLAGENTS_ROOT/.venv_release22"
LOG_DIR="$MLAGENTS_ROOT/training_logs"

mkdir -p "$LOG_DIR"

if [[ "$TRAINER_CONFIG_INPUT" = /* ]]; then
  TRAINER_CONFIG="$TRAINER_CONFIG_INPUT"
else
  TRAINER_CONFIG="$TACTICS_ROOT/$TRAINER_CONFIG_INPUT"
fi

if [ ! -f "$TRAINER_CONFIG" ]; then
  echo "Trainer config not found: $TRAINER_CONFIG"
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
    echo "Environment executable not found: $ENV_PATH"
    exit 1
  fi
  ENV_ARGS+=(--env "$ENV_PATH" --no-graphics)
fi

RUN_MODE_ARGS=()
if [ "$RUN_MODE" = "force" ]; then
  RUN_MODE_ARGS+=(--force)
elif [ "$RUN_MODE" = "resume" ]; then
  RUN_MODE_ARGS+=(--resume)
fi

echo "Starting run: $RUN_ID"
echo "Trainer config: $TRAINER_CONFIG"
echo "Safety timeout (hours): $TIMEOUT_HOURS"
echo "Using strict CPU-only mode"
echo "Logs: $LOG_DIR/${RUN_ID}.log"

cd "$MLAGENTS_ROOT"
source "$MLAGENTS_VENV/bin/activate"

CUDA_VISIBLE_DEVICES="" timeout "${TIMEOUT_HOURS}h" "$MLAGENTS_VENV/bin/mlagents-learn" "$TRAINER_CONFIG" \
  --run-id "$RUN_ID" \
  --torch-device cpu \
  "${ENV_ARGS[@]}" \
  "${RUN_MODE_ARGS[@]}" \
  2>&1 | tee "$LOG_DIR/${RUN_ID}.log"

EXIT_CODE=${PIPESTATUS[0]}

if [ "$EXIT_CODE" -eq 124 ]; then
  echo "Run $RUN_ID stopped by safety timeout after ${TIMEOUT_HOURS} hours."
else
  echo "Run $RUN_ID exited with code $EXIT_CODE."
fi
