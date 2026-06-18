"""Domain helper for bulk offline synchronization."""


def count_payload_items(payload):
    return {
        key: len(value)
        for key, value in payload.items()
        if isinstance(value, list)
    }
