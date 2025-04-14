import time
from collections import deque
from pathlib import Path

class DataLogger:
    def __init__(self, dest: Path):
        if not dest.is_dir():
            raise ValueError("Destination must be a directory.")

        self.dest = dest

    # Checks whether the last entry in the logfile with the given
    # name starts with the given time.
    def __check_last_entry(self, name: str, time: float) -> bool:
        fullpath: Path = self.dest / name
        with fullpath.open("r") as file:
            last_line: str = deque(file, 1)[0]
            entry_time: float = float(last_line.split(",")[0])
            return time == entry_time

    def log(self, name: str, time: float, value: float) -> None:
        fullpath: Path= self.dest / name
        if not fullpath.exists():
            fullpath.write_text(str(time) + ", " + str(value) + "\n")
        else:
            if self.__check_last_entry(name, time):
                with fullpath.open("ab") as file:
                    file.seek(-1, 2)
                    file.truncate()
                    nonbytes_str: str = ", " + str(value) + "\n"
                    file.write(nonbytes_str.encode("utf-8"))
            else:
                with fullpath.open("a") as file:
                    file.write(str(time) + ", " + str(value) + "\n")
