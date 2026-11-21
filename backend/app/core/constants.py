"""Hằng số dùng chung: nhãn personal color, trạng thái đơn hàng, voucher."""

PERSONAL_COLOR_LABELS: dict[str, str] = {
    "spring_warm": "Spring Warm",
    "summer_cool": "Summer Cool",
    "autumn_warm": "Autumn Warm",
    "winter_cool": "Winter Cool",
}

PERSONAL_COLOR_GROUPS: dict[str, str] = {
    "spring_warm": "Nhóm màu ấm – tươi sáng",
    "summer_cool": "Nhóm màu lạnh – dịu nhẹ",
    "autumn_warm": "Nhóm màu ấm – trầm ấm",
    "winter_cool": "Nhóm màu lạnh – tương phản cao",
}

ORDER_STATUS_LABELS: dict[str, str] = {
    "pending": "Chờ xác nhận",
    "packing": "Đang đóng gói",
    "shipping": "Đang giao",
    "delivered": "Đã giao",
    "returned": "Đổi trả",
    "cancelled": "Đã huỷ",
}

ORDER_STATUS_ORDER: list[str] = [
    "pending",
    "packing",
    "shipping",
    "delivered",
    "returned",
    "cancelled",
]

BRAND_SEGMENTS: dict[str, str] = {
    "low": "Phân khúc phổ thông",
    "mid": "Phân khúc trung bình",
    "high": "Phân khúc cao cấp",
}

VOUCHERS: dict[str, dict] = {
    "FREESHIP389": {"type": "freeship", "min_total": 389000, "label": "Freeship đơn từ 389k"},
    "LITI10": {"type": "percent", "value": 10, "min_total": 200000, "label": "Giảm 10% đơn từ 200k"},
    "LITI20": {"type": "percent", "value": 20, "min_total": 500000, "label": "Giảm 20% đơn từ 500k"},
    "HANDNOTE": {"type": "gift", "min_total": 0, "label": "Tặng thẻ hướng dẫn phối màu"},
}

DEFAULT_SHIPPING_FEE = 30000
FREE_SHIP_THRESHOLD = 389000
