
import os
import requests

def make_request(url: str, username: str = None, password: str = None, method: str = None, headers: dict = None,
                 data: dict = None, timeout: int = None, ) -> dict:
    # defaults.
    method = method or "GET"
    headers = headers or {'Content-Type': 'application/json'}
    timeout = timeout or 30  # seconds.

    if username and password:
        response = requests.request(method=method.upper(), url=url, headers=headers, json=data, timeout=timeout,
                                    auth=(username, password))
    else:
        response = requests.request(method=method.upper(), url=url, headers=headers, json=data, timeout=timeout)

    result = {
        "status_code": response.status_code,
        "success": response.ok,  # True for 2xx status codes
    }

    try:
        result["data"] = response.json()
    except requests.JSONDecodeError:
        result["data"] = None
        result["error"] = "Response is not valid JSON"

    if not response.ok:
        result["error"] = f"HTTP {response.status_code}: {response.reason}"

    return result


def send_blocks_as_slack_message(blocks: list, channel_id: str, thread_ts: str = None) -> dict[str, str]:
    token = os.environ.get("SLACK_API_TOKEN", None)
    if token is None:
        raise Exception("Environment variable SLACK_API_TOKEN not defined")
    token = token.strip()

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json; charset=utf-8"}
    payload = {"channel": channel_id, "blocks": blocks}
    if thread_ts:
        payload["thread_ts"] = thread_ts
    response = make_request("https://slack.com/api/chat.postMessage", method="POST", headers=headers, data=payload)
    return response
