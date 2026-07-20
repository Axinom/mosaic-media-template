"""Generate a consolidated daily Slack summary of the CB auto-release pipelines.

Reads the latest run (for the day) of the two build pipelines and the two
deploy pipelines, derives a per-service / per-workflow status from each run's
job conclusions, and posts:

  * one main summary message (one line per build/deploy combination), then
  * four threaded replies listing the tags/versions that were built and
    deployed (services built, workflows built, services deployed, workflows
    deployed).
"""
from common import make_request, send_blocks_as_slack_message
from datetime import datetime, timezone
import argparse
import os
import re
import sys


def log(message: str) -> None:
    print(f"[Daily Summary] {message}", flush=True)


# Pipelines to summarise, in the order their thread replies should appear.
# version_file is relative to .github/deployment-versions/.
PIPELINES = [
    {
        "key": "service_build",
        "label": "Service Builds",
        "workflow": "build-service.yml",
        "version_file": "services/cb.yaml",
        "noun": "services",
        "verb": "built",
    },
    {
        "key": "workflow_build",
        "label": "Workflow Builds",
        "workflow": "build-workflow.yml",
        "version_file": "workflows/cb.yaml",
        "noun": "workflows",
        "verb": "built",
    },
    {
        "key": "service_deploy",
        "label": "Service Deploys",
        "workflow": "deploy-services-prerelease.yml",
        "version_file": "services/cb.yaml",
        "noun": "services",
        "verb": "deployed",
    },
    {
        "key": "workflow_deploy",
        "label": "Workflow Deploys",
        "workflow": "deploy-workflows-prerelease.yml",
        "version_file": "workflows/cb.yaml",
        "noun": "workflows",
        "verb": "deployed",
    },
]

VERSIONS_DIR = os.path.join(os.path.dirname(__file__), "..", "deployment-versions")


def gh_api(repo: str, token: str, path: str, params: dict = None) -> dict:
    """Call the GitHub REST API for the repository."""
    url = f"https://api.github.com/repos/{repo}/{path}"
    if params:
        query = "&".join(f"{k}={v}" for k, v in params.items())
        url = f"{url}?{query}"
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Authorization": f"Bearer {token}",
    }
    response = make_request(url, method="GET", headers=headers)
    if not response["success"]:
        log(f"GitHub API call failed ({path}): {response.get('error')}")
        return {}
    return response["data"] or {}


def get_latest_run(repo: str, token: str, workflow_file: str, branch: str, target_date: str) -> dict:
    """Return the most recent run of a workflow created on target_date (UTC)."""
    data = gh_api(
        repo,
        token,
        f"actions/workflows/{workflow_file}/runs",
        {"branch": branch, "per_page": 30},
    )
    runs = data.get("workflow_runs", [])
    todays = [r for r in runs if (r.get("created_at") or "")[:10] == target_date]
    if not todays:
        return {}
    # The API returns runs newest first, but sort defensively.
    return max(todays, key=lambda r: r.get("created_at", ""))


def get_jobs(repo: str, token: str, run_id: int) -> list:
    """Return all jobs for a workflow run (handles pagination)."""
    jobs = []
    page = 1
    while True:
        data = gh_api(repo, token, f"actions/runs/{run_id}/jobs", {"per_page": 100, "page": page})
        batch = data.get("jobs", [])
        jobs.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return jobs


def status_for_item(jobs: list, item: str) -> str:
    """Derive a status (success/failure/skipped/unknown) for a single item.

    Build jobs carry the item in a matrix token, e.g. "Build Services (catalog, ...)".
    Deploy jobs carry it after "Deploy", e.g. ".../ Deploy catalog" or "Deploy Channel".
    The patterns are anchored so e.g. "media" never matches "media-workflows".
    """
    item_lc = item.lower()
    matrix_pat = re.compile(r"\(" + re.escape(item_lc) + r"[,)]")
    deploy_pat = re.compile(r"\bdeploy " + re.escape(item_lc) + r"\b")

    conclusions = []
    for job in jobs:
        name = (job.get("name") or "").lower()
        if matrix_pat.search(name) or deploy_pat.search(name):
            conclusions.append(job.get("conclusion") or job.get("status"))

    if not conclusions:
        return "unknown"
    if "failure" in conclusions:
        return "failure"
    if "success" in conclusions:
        return "success"
    if "skipped" in conclusions:
        return "skipped"
    return conclusions[0] or "unknown"


def read_versions(version_file: str) -> dict:
    """Parse a simple `key: value` deployment-versions file."""
    path = os.path.join(VERSIONS_DIR, version_file)
    items = {}
    with open(path) as handle:
        for line in handle:
            line = line.strip()
            if not line or line.startswith("#") or ":" not in line:
                continue
            key, value = line.split(":", 1)
            items[key.strip()] = value.strip().strip('"').strip("'")
    return items


STATUS_EMOJI = {
    "success": ":white_check_mark:",
    "failure": ":x:",
    "skipped": ":fast_forward:",
    "unknown": ":grey_question:",
}


def evaluate_pipeline(repo: str, token: str, pipeline: dict, branch: str, target_date: str) -> dict:
    """Collect per-item statuses and tags for a pipeline run."""
    versions = read_versions(pipeline["version_file"])
    run = get_latest_run(repo, token, pipeline["workflow"], branch, target_date)
    jobs = get_jobs(repo, token, run["id"]) if run else []

    items = []
    for name, tag in versions.items():
        status = status_for_item(jobs, name) if run else "unknown"
        items.append({"name": name, "tag": tag, "status": status})

    return {
        "pipeline": pipeline,
        "run": run,
        "items": items,
        "counts": {
            "total": len(items),
            "success": sum(1 for i in items if i["status"] == "success"),
            "failure": sum(1 for i in items if i["status"] == "failure"),
            "skipped": sum(1 for i in items if i["status"] == "skipped"),
        },
    }


def summary_line(result: dict) -> str:
    pipeline = result["pipeline"]
    counts = result["counts"]
    label = pipeline["label"]
    noun = pipeline["noun"]
    verb = pipeline["verb"]

    if not result["run"]:
        return f":grey_question: *{label}*: no run found today"

    run_url = result["run"].get("html_url", "")
    link = f" (<{run_url}|run>)" if run_url else ""

    if counts["failure"] == 0 and counts["success"] == counts["total"]:
        return f":white_check_mark: *{label}*: all {counts['total']} {noun} {verb} successfully{link}"

    parts = [f"{counts['success']} {verb}"]
    if counts["failure"]:
        parts.append(f"{counts['failure']} failed")
    if counts["skipped"]:
        parts.append(f"{counts['skipped']} skipped")
    emoji = ":x:" if counts["failure"] else ":warning:"
    return f"{emoji} *{label}*: {', '.join(parts)} of {counts['total']} {noun}{link}"


def items_block_text(result: dict) -> str:
    if not result["run"]:
        return "_No run found for today._"
    lines = []
    for item in result["items"]:
        emoji = STATUS_EMOJI.get(item["status"], ":grey_question:")
        lines.append(f"{emoji} *{item['name']}* - `{item['tag']}`")
    return "\n".join(lines) if lines else "_No items found._"


def parse_arguments():
    parser = argparse.ArgumentParser(description="Post the daily CB release summary to Slack.")
    parser.add_argument("--repo", required=True, help="Repository in owner/name form")
    parser.add_argument("--branch", default="master", help="Branch the pipelines run on")
    parser.add_argument("--slack-channel-id", required=True, help="Slack channel ID")
    parser.add_argument("--date", default="", help="Target UTC date (YYYY-MM-DD); defaults to today")
    return parser.parse_args()


def main():
    args = parse_arguments()
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    if not token:
        log("Environment variable GITHUB_TOKEN not defined")
        sys.exit(1)

    target_date = args.date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    log(f"Building summary for {args.repo}@{args.branch} on {target_date}")

    results = [evaluate_pipeline(args.repo, token, p, args.branch, target_date) for p in PIPELINES]

    # ---- Main summary message ---------------------------------------------- #
    has_failure = any(r["counts"]["failure"] for r in results)
    header_emoji = ":x:" if has_failure else ":white_check_mark:"
    main_blocks = [
        {
            "type": "header",
            "text": {"type": "plain_text", "text": f"{header_emoji} Daily Release Summary - {target_date}", "emoji": True},
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Repository:* <https://github.com/{args.repo}|{args.repo}>\n*Branch:* `{args.branch}`",
            },
        },
        {"type": "divider"},
        {"type": "section", "text": {"type": "mrkdwn", "text": "\n".join(summary_line(r) for r in results)}},
        {
            "type": "context",
            "elements": [
                {"type": "mrkdwn", "text": "Built & deployed tags follow in this thread :thread:"}
            ],
        },
    ]

    response = send_blocks_as_slack_message(main_blocks, args.slack_channel_id)
    if not response["success"] or not (response.get("data") or {}).get("ok"):
        log(f"Failed to post main summary message: {response.get('data') or response.get('error')}")
        sys.exit(1)
    thread_ts = response["data"]["ts"]
    log(f"Posted main summary; thread_ts={thread_ts}")

    # ---- Threaded replies: built & deployed tags --------------------------- #
    for result in results:
        pipeline = result["pipeline"]
        title = f"{pipeline['noun'].capitalize()} {pipeline['verb']}"
        reply_blocks = [
            {"type": "section", "text": {"type": "mrkdwn", "text": f"*{title}*"}},
            {"type": "section", "text": {"type": "mrkdwn", "text": items_block_text(result)}},
        ]
        reply = send_blocks_as_slack_message(reply_blocks, args.slack_channel_id, thread_ts)
        if not reply["success"]:
            log(f"Failed to post reply for {pipeline['key']}: {reply.get('error')}")
        else:
            log(f"Posted reply: {title}")


if __name__ == "__main__":
    main()
