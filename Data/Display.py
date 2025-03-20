from enum import Enum
from collections import deque as Deque
import types
import Website.Frontend as FrontEnd

class Display_Type(Enum):
    LINE_CHART = 0
    BAR_CHART = 1
    NUMBER = 2
    PIE_CHART = 3
    # ect ...


class Display:

    def __init__(self, name: str, display_type: Display_Type, history_size: int, column_names: []):
        self.name: str = name
        self.display_type: Display_Type = display_type

        self.history_size: int = history_size
        self.column_names = column_names
        self.history: Deque = Deque()  # contains arrays (each line in csv format), with length history_size

    # Data msg: <name>:<time>, <value>
    # Init msg: <name>, <graph1>, <graph2>:<name>, <graph1>:<name>, <graph2> ...

    def build_packet(self) -> str:
        csv: str = ""
        for datum in self.history:
            for p in datum:
                csv += str(p) + ","

            csv = csv[:-1]
            csv += "\n"

        if len(self.history) == 1:
            csv = csv[:-1]

        return self.name + ":" + csv

    def update(self, data_line: []) -> None:
        if not (len(data_line) == len(self.column_names)):
            raise ValueError("Line of data must be same size as amount of titles")

        self.history.appendleft(data_line)
        if len(self.history) > self.history_size:
            self.history.pop()  # remove element from end (oldest element)

        FrontEnd.broadcast_message(self.build_packet())
