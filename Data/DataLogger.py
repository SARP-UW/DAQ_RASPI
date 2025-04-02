import time
from pathlib import Path

class DataLogger:
    def __init__(self, dest: Path):
        if not dest.is_dir():
            raise ValueError("Destination must be a directory.")

        self.dest = dest

    def log(self, name: str, time: float, value: float) -> None:
        fullpath = self.dest / name
        if not fullpath.exists():
            fullpath.write_text(str(time) + ", " + str(value) + "\n")
        else:
            with fullpath.open("a") as file:
                file.write(str(time) + ", " + str(value) + "\n")
