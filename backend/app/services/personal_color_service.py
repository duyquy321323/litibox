"""Bài trắc nghiệm personal color: câu hỏi, cách tính điểm, bảng màu."""

from typing import Any

from app.core.constants import PERSONAL_COLOR_GROUPS, PERSONAL_COLOR_LABELS

QUESTIONS: list[dict[str, Any]] = [
    {
        "id": "undertone",
        "question": "Màu nền da của bạn nghiêng về?",
        "hint": "Nhìn vào gân tay dưới ánh sáng tự nhiên",
        "options": [
            {"id": "warm", "label": "Vàng ấm / gân tay xanh lá", "swatch": "#E8B26A",
             "scores": {"spring_warm": 2, "autumn_warm": 2}},
            {"id": "cool", "label": "Hồng lạnh / gân tay xanh tím", "swatch": "#D08C9B",
             "scores": {"summer_cool": 2, "winter_cool": 2}},
            {"id": "neutral", "label": "Trung tính, khó phân biệt", "swatch": "#D8BFA8",
             "scores": {"spring_warm": 1, "summer_cool": 1, "autumn_warm": 1, "winter_cool": 1}},
        ],
    },
    {
        "id": "contrast",
        "question": "Độ tương phản giữa da – tóc – mắt của bạn?",
        "options": [
            {"id": "high", "label": "Rất tương phản (da sáng, tóc/mắt đen)", "swatch": "#2B2B2B",
             "scores": {"winter_cool": 3}},
            {"id": "medium", "label": "Tương phản vừa", "swatch": "#8C6A4F",
             "scores": {"autumn_warm": 2, "summer_cool": 1}},
            {"id": "low", "label": "Mềm, ít tương phản", "swatch": "#E3C9B6",
             "scores": {"spring_warm": 2, "summer_cool": 2}},
        ],
    },
    {
        "id": "jewelry",
        "question": "Trang sức nào làm da bạn sáng nhất?",
        "options": [
            {"id": "gold", "label": "Vàng / vàng hồng", "swatch": "#E5B556",
             "scores": {"spring_warm": 2, "autumn_warm": 2}},
            {"id": "silver", "label": "Bạc / bạch kim", "swatch": "#C9CFD6",
             "scores": {"summer_cool": 2, "winter_cool": 2}},
            {"id": "both", "label": "Cả hai đều hợp", "swatch": "#D9C2A1",
             "scores": {"spring_warm": 1, "summer_cool": 1, "autumn_warm": 1, "winter_cool": 1}},
        ],
    },
    {
        "id": "lip_tone",
        "question": "Tông son khiến bạn tự tin nhất?",
        "options": [
            {"id": "peach", "label": "Cam đào, san hô", "swatch": "#F07A5A",
             "scores": {"spring_warm": 3}},
            {"id": "rosy", "label": "Hồng tro, hồng phấn", "swatch": "#E39AA8",
             "scores": {"summer_cool": 3}},
            {"id": "brick", "label": "Đỏ gạch, nâu đất", "swatch": "#A5473B",
             "scores": {"autumn_warm": 3}},
            {"id": "berry", "label": "Berry, đỏ rượu", "swatch": "#8E1F3F",
             "scores": {"winter_cool": 3}},
        ],
    },
    {
        "id": "white_shirt",
        "question": "Chiếc áo trắng nào bạn mặc đẹp nhất?",
        "options": [
            {"id": "ivory", "label": "Trắng ngà, trắng kem", "swatch": "#FBEFD9",
             "scores": {"spring_warm": 2, "autumn_warm": 1}},
            {"id": "pure", "label": "Trắng tinh, sắc nét", "swatch": "#FFFFFF",
             "scores": {"winter_cool": 2}},
            {"id": "coolgrey", "label": "Trắng xám, trắng tro", "swatch": "#E7E9EC",
             "scores": {"summer_cool": 2}},
        ],
    },
    {
        "id": "hair",
        "question": "Màu tóc nhuộm hợp với bạn?",
        "options": [
            {"id": "honey", "label": "Nâu mật ong, nâu vàng", "swatch": "#B0763C",
             "scores": {"spring_warm": 2, "autumn_warm": 1}},
            {"id": "ash", "label": "Nâu lạnh, ash grey", "swatch": "#8B8C90",
             "scores": {"summer_cool": 2, "winter_cool": 1}},
            {"id": "redbrown", "label": "Nâu đỏ, đỏ rượu", "swatch": "#7C3B2E",
             "scores": {"autumn_warm": 2, "winter_cool": 1}},
            {"id": "black", "label": "Đen tự nhiên", "swatch": "#1E1E1E",
             "scores": {"winter_cool": 2}},
        ],
    },
    {
        "id": "sun",
        "question": "Khi ra nắng, da bạn thế nào?",
        "options": [
            {"id": "burn", "label": "Dễ cháy nắng, đỏ rồi bong tróc", "swatch": "#E8A198",
             "scores": {"summer_cool": 1, "winter_cool": 2}},
            {"id": "tan", "label": "Rám nắng nhanh thành màu mật ong", "swatch": "#C48A55",
             "scores": {"spring_warm": 1, "autumn_warm": 2}},
            {"id": "rarely", "label": "Hầu như không đổi màu", "swatch": "#D9BE9E",
             "scores": {"spring_warm": 1, "summer_cool": 1}},
        ],
    },
    {
        "id": "style",
        "question": "Phong cách makeup bạn thích nhất?",
        "options": [
            {"id": "fresh", "label": "Tươi sáng, căng tràn sức sống", "swatch": "#FF9E7A",
             "scores": {"spring_warm": 3}},
            {"id": "soft", "label": "Mềm mại, trong trẻo", "swatch": "#F0C4D4",
             "scores": {"summer_cool": 3}},
            {"id": "warm", "label": "Trầm ấm, sang trọng", "swatch": "#9C6B4E",
             "scores": {"autumn_warm": 3}},
            {"id": "sharp", "label": "Sắc nét, cá tính", "swatch": "#9E1B32",
             "scores": {"winter_cool": 3}},
        ],
    },
]

def _palette(
    key: str, description: str, best: list[tuple[str, str]], avoid: list[tuple[str, str]]
) -> dict[str, Any]:
    return {
        "label": PERSONAL_COLOR_LABELS[key],
        "group": PERSONAL_COLOR_GROUPS[key],
        "description": description,
        "best_colors": [{"name": name, "hex": hex_code} for name, hex_code in best],
        "avoid_colors": [{"name": name, "hex": hex_code} for name, hex_code in avoid],
    }


PALETTES: dict[str, dict[str, Any]] = {
    "spring_warm": _palette(
        "spring_warm",
        "Da ấm, tươi sáng. Hợp tông cam đào, san hô, vàng mật ong và các màu trong trẻo.",
        [("Peach", "#FFB7A5"), ("Coral", "#FF7F5F"), ("Golden", "#F2C14E"), ("Cream", "#FBEAD9")],
        [("Deep Navy", "#23395B"), ("Icy Silver", "#C7D0DA")],
    ),
    "summer_cool": _palette(
        "summer_cool",
        "Da lạnh, dịu nhẹ. Hợp hồng tro, tím lilac, xanh phấn và các gam màu pastel.",
        [("Rose", "#F3B7C6"), ("Lilac", "#C4A7D9"), ("Powder Blue", "#A9C8E8"), ("Mauve", "#D9BCD1")],
        [("Orange", "#FF7A2F"), ("Mustard", "#D4A017")],
    ),
    "autumn_warm": _palette(
        "autumn_warm",
        "Da ấm, trầm. Hợp đỏ gạch, nâu camel, olive và các tông đất ấm.",
        [("Terracotta", "#C86B4A"), ("Camel", "#A9815A"), ("Olive", "#8A8B4B"), ("Brick", "#9E3B32")],
        [("Fuchsia", "#E0218A"), ("Ice Blue", "#BFE3F0")],
    ),
    "winter_cool": _palette(
        "winter_cool",
        "Da lạnh, tương phản cao. Hợp berry, đỏ tươi, navy và tím mận.",
        [("Berry", "#A31D4E"), ("True Red", "#D21F3C"), ("Navy", "#2E4057"), ("Plum", "#6C2C67")],
        [("Peach", "#FFB08A"), ("Beige", "#E6D3B3")],
    ),
}


def get_questions() -> list[dict[str, Any]]:
    return QUESTIONS


def get_palettes() -> dict[str, dict[str, Any]]:
    return PALETTES


def get_palette(color_key: str | None) -> dict[str, Any] | None:
    return PALETTES.get(color_key or "")


def score_answers(answers: dict[str, str]) -> dict[str, int]:
    """answers: {question_id: option_id} -> điểm cho từng nhóm màu."""
    scores = dict.fromkeys(PERSONAL_COLOR_LABELS, 0)
    for question in QUESTIONS:
        option_id = answers.get(question["id"])
        if not option_id:
            continue
        option = next((o for o in question["options"] if o["id"] == option_id), None)
        if not option:
            continue
        for color_key, points in option["scores"].items():
            scores[color_key] = scores.get(color_key, 0) + points
    return scores


def resolve_type(scores: dict[str, int]) -> str:
    order = ["spring_warm", "summer_cool", "autumn_warm", "winter_cool"]
    return max(order, key=lambda key: (scores.get(key, 0), -order.index(key)))

