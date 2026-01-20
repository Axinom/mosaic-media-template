import json
import argparse


def parse_args():
    parser = argparse.ArgumentParser(prog="ImageScanResultParser",
                                     description="Parse Image scanning Results",
                                     epilog="Managed by SE Team")
    parser.add_argument("--scan-result-file", dest="scan_result", type=str, required=True)
    parser.add_argument("--previous-scan-result-file", dest="scan_result_prev", type=str, required=True)
    return vars(parser.parse_args())


def read_json_file(file_path: str) -> dict:
    try:
        with open(file_path, 'r') as _:
            return json.loads(_.read())

    except Exception as e:
        print(f'Failed to read JSON file at {file_path} due to {e}')
        return {}


def parse_json_scan_results(file_path: str):
    vulnerability_counts = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'unknown': 0, 'total': 0}

    try:
        data = read_json_file(file_path)
        for result in data['Results']:
            if 'Vulnerabilities' in result.keys():
                vulnerability_counts['total'] += len(result['Vulnerabilities'])
                for vuln in result['Vulnerabilities']:
                    severity = vuln['Severity'].lower()
                    vulnerability_counts[severity] += 1
        return vulnerability_counts

    except Exception as e:
        print(f'Failed to parse scan results due to {e}')
        return None


def compare_results(new_results: dict[str, int], old_results: dict[str, int]):
    new_vulnerability_count = {}
    for severity, count_current in new_results.items():
        new_vulnerability_count[severity] = count_current - old_results[severity]
        new_vulnerability_count[severity] = 0 if new_vulnerability_count[severity] < 0 else new_vulnerability_count[
            severity]

    def format_line(severity, total, new_count):
        """Format each line with optional exclamation emoji."""
        exclamation = "❗" if new_count > 0 else ""
        return f"{severity}: {total} ({new_count} new){exclamation}"

    result = f'''ℹ️ Total vulnerabilities: {new_results['total']}\n
    🔴 {format_line("Critical", new_results['critical'], new_vulnerability_count['critical'])}\n
    🟠 {format_line("High", new_results['high'], new_vulnerability_count['high'])}\n
    🟡 {format_line("Medium", new_results['medium'], new_vulnerability_count['medium'])}\n
    🔵 {format_line("Low", new_results['low'], new_vulnerability_count['low'])}\n
    🤷‍♂️ {format_line("Unknown", new_results['unknown'], new_vulnerability_count['unknown'])}\n'''

    return result


if __name__ == '__main__':
    try:
        args = parse_args()
        current_results = parse_json_scan_results(args['scan_result'])
        previous_results = parse_json_scan_results(args['scan_result_prev'])

        compared_results = compare_results(current_results, previous_results)
        print(compared_results)

    except Exception as e:
        print(f'Failed due to {e}')
        exit(1)