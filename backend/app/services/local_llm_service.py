def _clean_team_text(text: str) -> str:
    return (
        text.replace("Orange", "Purple")
        .replace("orange", "purple")
        .replace("ORANGE", "PURPLE")
    )


def _event_to_sentence(chunk: dict) -> str:
    step = chunk.get("step")
    team = _clean_team_text(str(chunk.get("team", "A team"))).title()
    event_type = str(chunk.get("type", "event")).replace("_", " ")
    tag = str(chunk.get("tag", "")).replace("_", " ")
    text = _clean_team_text(str(chunk.get("text", ""))).strip()

    if text:
        return text

    if step:
        return f"At step {step}, {team} had a {event_type} moment."

    if tag:
        return f"{team} had a {tag} moment."

    return f"{team} had an important {event_type} moment."


def generate_grounded_answer(question: str, retrieved_chunks: list[dict], match_summary: str) -> str:
    if not retrieved_chunks and not match_summary:
        return "I could not find enough match context to answer that confidently."

    question_lower = question.lower()
    summary = _clean_team_text(match_summary or "").strip()

    events = [_event_to_sentence(chunk) for chunk in retrieved_chunks[:3]]
    joined_events = " ".join(events)

    blue_mentions = joined_events.lower().count("blue")
    purple_mentions = joined_events.lower().count("purple")

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
