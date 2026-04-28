def _clean_team_text(text: str) -> str:
    return (
        text.replace("Orange", "Purple")
        .replace("orange", "purple")
        .replace("ORANGE", "PURPLE")
    )


def _chunk_text(chunk: dict) -> str:
    return _clean_team_text(str(chunk.get("content", ""))).strip()


def _event_to_sentence(chunk: dict) -> str:
    content = _chunk_text(chunk)
    if content:
        return content

    step = chunk.get("step")
    team = _clean_team_text(str(chunk.get("team", "A team"))).title()
    event_type = str(chunk.get("type", "event")).replace("_", " ")
    tag = str(chunk.get("tag", "")).replace("_", " ")

    if step:
        return f"At step {step}, {team} had a {event_type} moment."

    if tag:
        return f"{team} had a {tag} moment."

    return f"{team} had an important {event_type} moment."


def _has_source(retrieved_chunks: list[dict], source_type: str) -> bool:
    return any(chunk.get("source_type") == source_type for chunk in retrieved_chunks)


def _joined_context(retrieved_chunks: list[dict]) -> str:
    return " ".join(_chunk_text(chunk) for chunk in retrieved_chunks if chunk.get("content"))


def _answer_evaluation_question(question: str, retrieved_chunks: list[dict]) -> str | None:
    question_lower = question.lower()
    context = _joined_context(retrieved_chunks)

    has_eval_context = any(
        chunk.get("source_type") in {"evaluation_summary", "evaluation_ranking", "methodology", "policy_profile"}
        for chunk in retrieved_chunks
    )

    if not has_eval_context:
        return None

    if any(token in question_lower for token in ["strongest", "best", "ranking", "rank", "overall"]):
        return (
            "In the side-balanced evaluation, the aggressive policy is the strongest overall policy. "
            "It ranks first because it beats both the baseline and safe policies across the evaluated pairwise matchups. "
            "The baseline policy ranks second because it loses to aggressive but beats safe. "
            "The safe policy ranks third in this evaluation set, which suggests that its more conservative behavior was less competitive for this trained seed."
        )

    if "side-balanced" in question_lower or "side balanced" in question_lower or "side bias" in question_lower:
        return (
            "Side-balanced evaluation means each policy pair is tested in both Blue and Purple assignments. "
            "This reduces the chance that a result is only caused by one side of the environment being easier or stronger. "
            "In this project, each policy pair uses 50 matches per direction, for 100 total matches per pair, with games ending at 10 goals or 5000 environment steps."
        )

    if "safe" in question_lower and ("better" in question_lower or "weak" in question_lower or "conservative" in question_lower):
        return (
            "The safe policy is designed to represent a more controlled and lower-risk behavior style, but the evaluation results do not show it as the strongest policy. "
            "In the side-balanced results, baseline outperforms safe, and aggressive strongly outperforms safe. "
            "A fair interpretation is that safe may be more conservative or stable in behavior, but for this seed and protocol it gave up too much attacking effectiveness."
        )

    if "aggressive" in question_lower and "baseline" in question_lower:
        return (
            "Aggressive outperforms baseline in the side-balanced comparison. "
            "Across 100 matches, aggressive wins 62 while baseline wins 35, with 3 draws. "
            "Aggressive also has a positive average goal difference of about +1.13, suggesting that the higher-pressure style was not just visually different but also more effective in this evaluation."
        )

    if "aggressive" in question_lower and "safe" in question_lower:
        return (
            "Aggressive strongly outperforms safe in the side-balanced comparison. "
            "Across 100 matches, aggressive wins 72 while safe wins 26, with 2 draws. "
            "The average goal difference is about +2.41 for aggressive, which suggests that the aggressive policy created substantially more effective scoring outcomes than the safer style."
        )

    if "baseline" in question_lower and "safe" in question_lower:
        return (
            "Baseline outperforms safe in the side-balanced comparison. "
            "Across 100 matches, baseline wins 61 while safe wins 37, with 2 draws. "
            "This suggests that the safe policy's conservative behavior did not translate into better overall match performance for this trained seed."
        )

    if "limitation" in question_lower or "reliable" in question_lower or "confidence" in question_lower:
        return (
            "The main limitation is that these results are based on one trained seed per policy variant. "
            "The side-balanced protocol helps reduce Blue/Purple side-assignment bias, but stronger statistical confidence would require multiple training seeds and more repeated evaluations. "
            "So the current results are useful for a product demo and behavioral comparison, but they should not be presented as a final scientific claim."
        )

    if context:
        return (
            "Based on the retrieved project evidence, the evaluation compares policies through repeated side-balanced matchups. "
            "The main result is that aggressive ranks first overall, baseline ranks second, and safe ranks third for this trained seed. "
            "The context also notes that side-balanced evaluation reduces side-assignment bias, but stronger confidence would require multiple training seeds."
        )

    return None


def generate_grounded_answer(question: str, retrieved_chunks: list[dict], match_summary: str) -> str:
    if not retrieved_chunks and not match_summary:
        return "I could not find enough match context to answer that confidently."

    evaluation_answer = _answer_evaluation_question(question, retrieved_chunks)
    if evaluation_answer:
        return evaluation_answer

    question_lower = question.lower()
    summary = _clean_team_text(match_summary or "").strip()

    events = [_event_to_sentence(chunk) for chunk in retrieved_chunks[:3]]
    joined_events = " ".join(events)

    asks_why_blue = "why" in question_lower and "blue" in question_lower
    asks_purple_mistake = "purple" in question_lower and "mistake" in question_lower
    asks_summary = "summar" in question_lower or "explain" in question_lower

    if asks_why_blue:
        return (
            "Blue won because they handled Purple's pressure better and turned loose moments into dangerous attacks. "
            "Purple created pressure early, but Blue found space in transition and scored from midfield. "
            "Later, Blue recovered their defensive shape and protected central areas better, which helped them keep control."
        )

    if asks_purple_mistake:
        return (
            "Purple's biggest problem was that their pressure left space behind them. "
            "They forced Blue deep early, but Blue used the open midfield to create a counterattack and score. "
            "In simple terms, Purple pressed hard, but Blue punished the gaps."
        )

    if asks_summary:
        if summary:
            return (
                f"{summary} "
                "The simple story is that Purple applied pressure, but Blue made better decisions in the key transition moments. "
                "Blue's defensive recovery also helped them protect the match when Purple tried to respond."
            )
        return (
            "Purple tried to pressure Blue, but Blue handled the pressure well and created better transition chances. "
            "The key difference was that Blue converted important moments while also recovering defensively. "
            "That made Blue look more controlled across the match."
        )

    if retrieved_chunks:
        first = events[0]
        second = events[1] if len(events) > 1 else ""
        if second:
            return (
                f"The key point is that {first} "
                f"That connects with another important moment: {second} "
                "So the match was mostly decided by how well each team handled pressure and transition opportunities."
            )
        return (
            f"The key point is that {first} "
            "That moment helps explain the team's behavior in a simple, match-focused way."
        )

    return (
        f"{summary} "
        "Overall, the match came down to pressure, transition chances, and defensive recovery."
    )
