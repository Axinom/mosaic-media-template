from typing import List, Dict
import xmltodict
import os


def find_result_xml_files(working_directory: str) -> List[str]:
    result_files = []
    if os.path.isdir(working_directory):
        for path, _, files in os.walk(working_directory):
            result_files.extend([os.path.join(path, f) for f in files if f == "results.xml" or "junit.xml" in f])
    return result_files


def parse_xml_to_dict(xml_file_path: str) -> dict:
    data = {}
    try:
        with open(xml_file_path, "r") as _:
            data = xmltodict.parse(_.read())
    except FileNotFoundError as e:
        print(f"Results file {xml_file_path} not found")
    except ValueError as e:
        print(f"File {xml_file_path} does not contain valid XML")
    return data


def create_slack_message_blocks_for_test_result_file(xml_file_path: str, relative_path: str) -> List[Dict]:
    header = f"*📊 Test Results for* _[{relative_path}]_"
    content = parse_xml_to_dict(xml_file_path)
    test_count, failed_count, skipped_count, error_count = int(content["testsuites"]["@tests"]), \
        int(content["testsuites"]["@failures"]), int(content["testsuites"].get("@skipped",0)), \
        int(content["testsuites"]["@errors"])
    successful_count = test_count - (failed_count + skipped_count + error_count)
    blocks = [
        {"type": "divider"},
        {"block_id": str(hash(xml_file_path)), "type": "section", "text": {"type": "mrkdwn", "text": header, }}
    ]

    context_elements = []
    if successful_count > 0:
        context_elements.append({"type": "plain_text", f"text": f"🟢 Passed: {successful_count} / {test_count}"})
    if skipped_count > 0:
        context_elements.append({"type": "plain_text", f"text": f"🟠 Skipped: {skipped_count} / {test_count}"})
    if failed_count > 0:
        context_elements.append({"type": "plain_text", f"text": f"🔴 Failed: {failed_count} / {test_count}"})
    if error_count > 0:
        context_elements.append({"type": "plain_text", f"text": f"🐞 Errored: {error_count} / {test_count}"})
    if not context_elements:
        context_elements.append({"type": "plain_text", f"text": f"Test results not available"})
    blocks.append({"type": "context", "elements": context_elements})

    return blocks


def create_slack_message_blocks_for_test_result_files(test_result_directory: str) -> List[dict]:
    blocks = []
    for path in find_result_xml_files(test_result_directory):
        test_result_file_name = os.path.relpath(path, test_result_directory)
        blocks.extend(create_slack_message_blocks_for_test_result_file(path, test_result_file_name))

    return blocks

def chunk_list(input_list, chunk_size):
    return [input_list[i:i + chunk_size] for i in range(0, len(input_list), chunk_size)]

def create_slack_message_blocks_for_unit_test_result_files(test_result_directory: str) -> List[dict]:
    blocks = []
    final_blocks=[]
    for path in find_result_xml_files(test_result_directory):
        test_result_file_name = os.path.relpath(path, test_result_directory)
        blocks.extend(create_slack_message_blocks_for_test_result_file(path, test_result_file_name))

    chunk_size=48
    final_blocks = chunk_list(blocks, chunk_size)

    return final_blocks