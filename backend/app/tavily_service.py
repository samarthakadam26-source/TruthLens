
"""Tavily web search service for TruthLens."""

import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

from flask import current_app


TAVILY_SEARCH_URL = "https://api.tavily.com/search"


class TavilySearchError(Exception):
    """Raised when the Tavily search request fails."""


def search_web(query: str, max_results: int = 5) -> list:
    """Search the web and return relevant source information."""

    if not isinstance(query, str) or not query.strip():
        raise ValueError("Search query cannot be empty.")

    if not 1 <= max_results <= 10:
        raise ValueError("max_results must be between 1 and 10.")

    api_key = current_app.config.get("TAVILY_API_KEY")

    if not api_key:
        raise TavilySearchError("Tavily API key is not configured.")

    payload = {
        "query": query.strip(),
        "search_depth": "basic",
        "topic": "general",
        "max_results": max_results,
        "include_answer": False,
        "include_raw_content": False
    }

    request = Request(
        TAVILY_SEARCH_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        method="POST"
    )

    try:
        with urlopen(request, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))

    except HTTPError as error:
        if error.code == 401:
            raise TavilySearchError(
                "Tavily authentication failed. Check your API key."
            ) from error

        if error.code == 429:
            raise TavilySearchError(
                "Tavily rate limit or usage limit reached."
            ) from error

        raise TavilySearchError(
            f"Tavily search failed with HTTP {error.code}."
        ) from error

    except (URLError, TimeoutError) as error:
        raise TavilySearchError(
            "Could not connect to Tavily. Check your internet connection."
        ) from error

    except json.JSONDecodeError as error:
        raise TavilySearchError(
            "Tavily returned an invalid response."
        ) from error

    results = data.get("results", [])

    return [
        {
            "title": result.get("title", ""),
            "url": result.get("url", ""),
            "content": result.get("content", ""),
            "score": result.get("score"),
            "published_date": result.get("published_date")
        }
        for result in results
        if isinstance(result, dict)
    ]


def extract_webpages(urls: list, query: str = "") -> dict:
    """Extract webpage content from selected source URLs."""

    from urllib.parse import urlparse

    if not isinstance(urls, list) or not urls:
        raise ValueError("At least one source URL is required.")

    if len(urls) > 5:
        raise ValueError("A maximum of 5 URLs can be extracted.")

    valid_urls = []

    for url in urls:
        if not isinstance(url, str):
            continue

        parsed = urlparse(url)

        if parsed.scheme in ("http", "https") and parsed.netloc:
            if url not in valid_urls:
                valid_urls.append(url)

    if not valid_urls:
        raise ValueError("No valid source URLs were provided.")

    api_key = current_app.config.get("TAVILY_API_KEY")

    if not api_key:
        raise TavilySearchError("Tavily API key is not configured.")

    payload = {
    "urls": valid_urls,
    "extract_depth": "basic",
    "query": query.strip(),
    "chunks_per_source": 3,
    "format": "text"
}

    request = Request(
        "https://api.tavily.com/extract",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        method="POST"
    )

    try:
        with urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))

    except HTTPError as error:
        if error.code == 401:
            raise TavilySearchError(
                "Tavily authentication failed."
            ) from error

        if error.code == 429:
            raise TavilySearchError(
                "Tavily usage limit reached."
            ) from error

        raise TavilySearchError(
            f"Tavily extraction failed with HTTP {error.code}."
        ) from error

    except (URLError, TimeoutError) as error:
        raise TavilySearchError(
            "Could not connect to Tavily Extract API."
        ) from error

    except json.JSONDecodeError as error:
        raise TavilySearchError(
            "Tavily returned an invalid extraction response."
        ) from error

    return {
        "results": [
            {
                "url": item.get("url", ""),
                "raw_content": item.get("raw_content", "")
            }
            for item in data.get("results", [])
        ],
        "failed_results": data.get("failed_results", [])
    }

