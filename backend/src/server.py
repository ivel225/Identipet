"""Development server entry point.

Use `python manage.py runserver` from the backend directory for local
development. This module exists to mirror the full-stack reference layout while
keeping Django's canonical server command intact.
"""

from django.core.management import execute_from_command_line


def run():
    execute_from_command_line(["manage.py", "runserver"])


if __name__ == "__main__":
    run()
