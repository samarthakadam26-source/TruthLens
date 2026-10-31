
"""NLP text preprocessing utilities used by training and prediction."""

import re
import string


def preprocess_text(text: str) -> str:
    """Lowercase text, remove HTML, URLs, digits and punctuation."""

    if not isinstance(text, str):
        return ""

    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)

    # Remove URLs
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)

    # Convert to lowercase
    text = text.lower()

    # Remove digits
    text = re.sub(r"\d+", " ", text)

    # Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))

    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text
