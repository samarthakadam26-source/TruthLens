
"""Evidence search and webpage extraction routes for TruthLens."""

from flask import Blueprint, jsonify, request

from app.auth import login_required
from app.tavily_service import (
    search_web,
    extract_webpages,
    TavilySearchError
)


bp = Blueprint("verification", __name__, url_prefix="/api")


@bp.route("/evidence-search", methods=["POST"])
@login_required
def evidence_search():
    """Search the web and retrieve relevant webpage excerpts."""

    data = request.get_json(silent=True) or {}
    claim = data.get("claim")

    if not isinstance(claim, str):
        return jsonify({"error": "Please provide a valid claim."}), 400

    claim = claim.strip()

    if len(claim) < 10 or len(claim) > 1000:
        return jsonify({
            "error": "Claim must contain between 10 and 1000 characters."
        }), 400

    # Step 1: Search the web.
    try:
        results = search_web(claim, max_results=5)

    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    except TavilySearchError as error:
        return jsonify({"error": str(error)}), 502

    # Step 2: Remove duplicate URLs.
    unique_results = []
    seen_urls = set()

    for result in results:
        url = result.get("url", "")

        if not isinstance(url, str):
            continue

        normalized_url = url.rstrip("/").lower()

        if normalized_url and normalized_url not in seen_urls:
            seen_urls.add(normalized_url)
            unique_results.append(result)

    results = unique_results

    # Step 3: Extract relevant webpage excerpts.
    urls = [
        result["url"]
        for result in results
        if result.get("url")
    ]

    extracted_by_url = {}

    try:
        extraction = extract_webpages(urls[:5], query=claim)

        for item in extraction.get("results", []):
            url = item.get("url", "")
            content = item.get("raw_content", "")

            if isinstance(url, str) and isinstance(content, str):
                if content.strip():
                    extracted_by_url[url] = content.strip()

    except (ValueError, TavilySearchError):
        # Use search snippets if webpage extraction fails.
        pass

    # Step 4: Prepare the final evidence sources.
    sources = []

    for result in results:
        url = result.get("url", "")
        extracted_content = extracted_by_url.get(url, "")

        if extracted_content:
            content = extracted_content
            content_type = "extracted_excerpt"
        else:
            content = result.get("content", "")
            content_type = "search_snippet"

        if not isinstance(content, str):
            content = ""

        sources.append({
            "title": result.get("title", ""),
            "url": url,
            "content": content[:6000],
            "content_type": content_type,
            "content_truncated": len(content) > 6000,
            "score": result.get("score"),
            "published_date": result.get("published_date")
        })

    extracted_count = len(extracted_by_url)

    return jsonify({
        "claim": claim,
        "status": "EVIDENCE_RETRIEVED",
        "sources": sources,
        "extracted_pages": extracted_count,
        "message": (
            f"Search completed. Relevant webpage excerpts retrieved "
            f"for {extracted_count} of {len(results)} sources. "
            "Sources have not yet been independently verified."
        )
    }), 200
