from parse_test_results import create_slack_message_blocks_for_test_result_files, create_slack_message_blocks_for_unit_test_result_files
from typing import Dict
import json
import requests
import argparse


class Slack:
    def __init__(self, token: str, channel_id: str):
        self.token = token
        self.channel_id = channel_id
        self.slack_api_url = "https://slack.com/api/chat.postMessage"
        self.run_base_url = "https://dev.azure.com/axinom/DutchChannels/_build/results?buildId={run_id}&view=results"
        self.test_summary_base_url = "https://dev.azure.com/axinom/DutchChannels/_build/results?buildId={run_id}" \
                                 "&view=ms.vss-test-web.build-test-results-tab"
        self.run_commit_url = "https://dev.azure.com/axinom/DutchChannels/_git/bd-mosaic/commit/{commit_id}"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json; charset=utf-8"
        }
        self.session = requests.session()

    def send_message(self, blocks: list, thread_ts: str = None) -> (int, dict):
        payload = {"channel": self.channel_id, "blocks": blocks}
        if thread_ts is not None:
            payload["thread_ts"] = thread_ts
        response = self.session.post(self.slack_api_url, headers=self.headers, data=json.dumps(payload))
        return response.status_code, response.json()

    def create_deployment_notice_slack_thread(self, *,
                                              deployment_pipeline_run_id: str,
                                              deployment_commit_id: str,
                                              deployment_name: str,
                                              additional_message: str) -> (bool, str):
        pipeline_run_url = self.run_base_url.format(run_id=deployment_pipeline_run_id)
        commit_url = self.run_commit_url.format(commit_id=deployment_commit_id)
        message_head = f"🚀  *Image scan results for <{pipeline_run_url}|{deployment_name}>*\n" \
                  f"_Commit: <{commit_url}|{deployment_commit_id}>_\n" \
                  
        message_results = f"{additional_message}"
        
        blocks = [{"type": "section", "text": {"type": "mrkdwn", "text": f"{message_head}"}},{"type": "divider","block_id": "divider1"},{"type": "rich_text", "elements": [{"type": "rich_text_quote", "elements": [{ "type": "text", "text": f"{message_results}"}]}]}]
        _, response = self.send_message(blocks)
        print(response)

        return (True, response["ts"]) if "ts" in response.keys() else (False, "0.0")
    
    def create_build_failed_notice_slack_thread(self, *,
                                              deployment_pipeline_run_id: str,
                                              deployment_commit_id: str,
                                              deployment_name: str) -> (bool, str):
        pipeline_run_url = self.run_base_url.format(run_id=deployment_pipeline_run_id)
        commit_url = self.run_commit_url.format(commit_id=deployment_commit_id)
        message_head = f"❌ *Build failed <{pipeline_run_url}|{deployment_name}>*\n" \
                  f"_Commit: <{commit_url}|{deployment_commit_id}>_\n"
        
        blocks = [{"type": "section", "text": {"type": "mrkdwn", "text": f"{message_head}"}},{"type": "divider","block_id": "divider1"}]
        _, response = self.send_message(blocks)
        print(response)

        return (True, response["ts"]) if "ts" in response.keys() else (False, "0.0")

    def post_deployment_status_to_deployment_notice_slack_thread(self, *,
                                                                 build_pipeline_run_id: str,
                                                                 build_pipeline_run_name: str,
                                                                 build_commit_id: str,
                                                                 parent_slack_thread_ts: str,
                                                                 deployment_name: str,
                                                                 deployment_status: str,
                                                                 additional_message: str = None) -> (bool, str):
        pipeline_run_url = self.run_base_url.format(run_id=build_pipeline_run_id)
        commit_url = self.run_commit_url.format(commit_id=build_commit_id)
        message = f"{deployment_status}  {deployment_name}: <{pipeline_run_url}|{build_pipeline_run_name}>\n" \
                  f"_Commit: <{commit_url}|{build_commit_id}>_"
        if additional_message and additional_message != "":
            message += "\n" + additional_message
        message = message[:2999]

        _, response = self.send_message([
            {"type": "section", "text": {"type": "mrkdwn", "text": message}}], parent_slack_thread_ts)
        return (True, response["ts"]) if "ts" in response.keys() else (False, "0.0")

    def create_test_case_notice_slack_thread(self, *,
                                             deployment_category: str,
                                             deployment_pipeline_run_id: str,
                                             deployment_pipeline_run_name: str,
                                             deployment_commit_id: str,
                                             test_result_parent_dir_path: str,
                                             ) -> (bool, str):
        pipeline_run_url = self.test_summary_base_url.format(run_id=deployment_pipeline_run_id)
        commit_url = self.run_commit_url.format(commit_id=deployment_commit_id)
        message = f"💫  *Nightly {deployment_category.title()} for <{pipeline_run_url}|{deployment_pipeline_run_name}>*\n" \
                  f"_Commit: <{commit_url}|{deployment_commit_id}>_"
        blocks = [{"type": "section", "text": {"type": "mrkdwn", "text": f"{message}"}}]
        blocks.extend(create_slack_message_blocks_for_test_result_files(test_result_parent_dir_path))
        _, response = self.send_message(blocks)
        return (True, response["ts"]) if "ts" in response.keys() else (False, "0.0")

    def create_unit_test_notice_slack_thread(self, *,
                                              deployment_category: str,
                                              deployment_pipeline_run_id: str,
                                              deployment_pipeline_run_name: str,
                                              deployment_commit_id: str,
                                              test_status: str,) -> (bool, str):
        pipeline_run_url = self.run_base_url.format(run_id=deployment_pipeline_run_id)
        commit_url = self.run_commit_url.format(commit_id=deployment_commit_id)
        message = f"💫  *Nightly {deployment_category.title()} for <{pipeline_run_url}|{deployment_pipeline_run_name}>*\n" \
                  f"_Commit: <{commit_url}|{deployment_commit_id}>_"
        blocks = [{"type": "section", "text": {"type": "mrkdwn", "text": f"{message}"}}]
        test_status_block = [
        {"type": "divider"},
        {"type": "context", "elements": [{"type": "plain_text", f"text": f"Unit Tests Status: {test_status}"}]}
        ]
        blocks.extend(test_status_block)
        _, response = self.send_message(blocks)
        return (True, response["ts"]) if "ts" in response.keys() else (False, "0.0")

    def create_unit_test_case_notice_slack_thread(self, *,
                                             deployment_pipeline_run_id: str,
                                             deployment_pipeline_run_name: str,
                                             deployment_commit_id: str,
                                             test_result_parent_dir_path: str,
                                             parent_slack_thread_ts: str,
                                             block: list,
                                             ) -> (bool, str):
        pipeline_run_url = self.test_summary_base_url.format(run_id=deployment_pipeline_run_id)
        commit_url = self.run_commit_url.format(commit_id=deployment_commit_id)
        blocks=[]
        blocks.extend(block)
        _, response = self.send_message(blocks, parent_slack_thread_ts)
        return (True, response["ts"]) if "ts" in response.keys() else (False, "0.0")


def parse_args() -> Dict[str, str]:
    parser = argparse.ArgumentParser(prog="ImageScanNotifier",
                                     description="Slack Notifier for BeyondDutch",
                                     epilog="Managed by SE Team")
    parser.add_argument("--token", dest="token", type=str, required=True)
    parser.add_argument("--channel-id", dest="channel_id", type=str, required=True)
    parser.add_argument("--action", dest="action", type=str, required=True, choices=["create", "reply", "build-failed", "test-results", "unit-test-results"])

    # Arguments for creating a new thread for deployment pipeline status.
    parser.add_argument("--deployment-pipeline-run-id", dest="deployment_pipeline_run_id", type=str)
    parser.add_argument("--deployment-pipeline-run-name", dest="deployment_pipeline_run_name", type=str)
    parser.add_argument("--deployment-commit-id", dest="deployment_commit_id", type=str)
    parser.add_argument("--deployment-category", dest="deployment_category", type=str, default="Deployments")

    # Arguments for creating a new reply for deployment status in an existing thread.
    parser.add_argument("--build-pipeline-run-id", dest="build_pipeline_run_id", type=str)
    parser.add_argument("--build-pipeline-run-name", dest="build_pipeline_run_name", type=str)
    parser.add_argument("--build-commit-id", dest="build_commit_id", type=str)
    parser.add_argument("--parent-slack-thread-ts", dest="parent_slack_thread_ts", type=str)
    parser.add_argument("--deployment-name", dest="deployment_name", type=str)
    parser.add_argument("--deployment-status", dest="deployment_status", type=str)
    parser.add_argument("--additional-message", dest="additional_message", type=str)

    # Arguments for posting test suite results.
    parser.add_argument("--test-result-parent-dir-path", dest="test_result_parent_dir_path", type=str)

    return vars(parser.parse_args())


def main():
    token, channel, action, deployment_pipeline_run_id, deployment_pipeline_run_name, deployment_commit_id, \
        deployment_category, build_pipeline_run_id, build_pipeline_run_name, build_commit_id, parent_slack_thread_ts, \
        deployment_name, deployment_status, additional_message, test_result_parent_dir_path = parse_args().values()

    slack = Slack(token, channel)

    if action == "create":
        if None not in [deployment_commit_id]:
            deployment_name = deployment_name.replace("-", " ").title()
            successful, ts = slack.create_deployment_notice_slack_thread(
                deployment_pipeline_run_id=deployment_pipeline_run_id,
                deployment_commit_id=deployment_commit_id,
                additional_message=additional_message,
                deployment_name=deployment_name)
            print(ts)
        else:
            print("--deployment-commit-id "
                  "args must be provided")
            
    elif action == "build-failed":
        if None not in [deployment_commit_id]:
            deployment_name = deployment_name.replace("-", " ").title()
            successful, ts = slack.create_build_failed_notice_slack_thread(
                deployment_pipeline_run_id=deployment_pipeline_run_id,
                deployment_commit_id=deployment_commit_id,
                deployment_name=deployment_name)
            print(ts)
        else:
            print("--deployment-commit-id "
                  "args must be provided")

    elif action == "reply":
        if None not in [build_commit_id, build_pipeline_run_name, build_pipeline_run_name,
                        parent_slack_thread_ts, deployment_name, deployment_status]:
            deployment_name = deployment_name.replace("-", " ").title()
            successful, _ = slack.post_deployment_status_to_deployment_notice_slack_thread(
                build_pipeline_run_id=build_pipeline_run_id,
                build_pipeline_run_name=build_pipeline_run_name,
                build_commit_id=build_commit_id,
                parent_slack_thread_ts=parent_slack_thread_ts,
                deployment_name=deployment_name,
                deployment_status=deployment_status,
                additional_message=additional_message)
            status = f"Successfully replied to slack thread {parent_slack_thread_ts}" if successful else \
                f"Failed to reply to slack thread {parent_slack_thread_ts}"
            print(status)
        else:
            print("--build_-pipeline-run-id, --build-pipeline-run-name, --build-commit-id, --parent-slack-thread_ts, "
                  "--deployment-name, --deployment-status args must be provided")

    elif action == "test-results":
        if None not in [deployment_pipeline_run_name, deployment_commit_id, deployment_commit_id,
                        test_result_parent_dir_path]:
            successful, ts = slack.create_test_case_notice_slack_thread(
                deployment_pipeline_run_id=deployment_pipeline_run_id,
                deployment_pipeline_run_name=deployment_pipeline_run_name,
                deployment_commit_id=deployment_commit_id,
                deployment_category=deployment_category,
                test_result_parent_dir_path=test_result_parent_dir_path,
            )
            print(ts)
        else:
            print("--deployment-pipeline-run-id, --deployment-pipeline-run-name, --deployment-commit-id "
                  "--test-result-parent-dir-path args must be provided")

    elif action == "unit-test-results":
        if None not in [deployment_pipeline_run_name, deployment_commit_id, deployment_commit_id,
                        test_result_parent_dir_path]:
            #create parent thread
            successful, tsp = slack.create_unit_test_notice_slack_thread(
                deployment_pipeline_run_id=deployment_pipeline_run_id,
                deployment_pipeline_run_name=deployment_pipeline_run_name,
                deployment_commit_id=deployment_commit_id,
                deployment_category=deployment_category,
                test_status=deployment_status)

            #reply to parent thread
            block=create_slack_message_blocks_for_unit_test_result_files(test_result_parent_dir_path)
            for i in block:
                successful, ts= slack.create_unit_test_case_notice_slack_thread(
                    deployment_pipeline_run_id=deployment_pipeline_run_id,
                    deployment_pipeline_run_name=deployment_pipeline_run_name,
                    deployment_commit_id=deployment_commit_id,
                    test_result_parent_dir_path=test_result_parent_dir_path,
                    parent_slack_thread_ts=tsp,
                    block=i
                )
                print(ts)
        else:
            print("--deployment-pipeline-run-id, --deployment-pipeline-run-name, --deployment-commit-id "
                  "--test-result-parent-dir-path args must be provided")

if __name__ == "__main__":
    main()