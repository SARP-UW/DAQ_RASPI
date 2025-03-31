import json
from enum import Enum
from collections import deque as Deque
import Website.Frontend as FrontEnd

class Display_Type(Enum):
    LINE_CHART = 0
    BAR_CHART = 1
    NUMBER = 2
    PIE_CHART = 3
    # ect ...

class DataHistory:

    def __init__(self, max_size: int, column_names: [str]):
        self.history: Deque = Deque()  # contains arrays (each line in csv format), with length history_size
        self.max_size: int = max_size
        self.column_names: [str] = column_names

    def push(self, data_line: []):
        if not (len(data_line) == len(self.column_names)):
            raise ValueError("Line of data must be same size as amount of titles")

        self.history.appendleft(data_line)
        if len(self.history) > self.max_size:
            self.history.pop()  # remove element from end (oldest element)

    def __dict__(self):
        timestamps: [] = []
        values: [] = []

        for pair in self.history:
            timestamps.append(pair[0])
            values.append(pair[1])

        return {
            "timestamps" : timestamps,
            "values" : values,
        }

class Display:

    def __init__(self, name: str, display_type: Display_Type, history_size: int, column_names: []):
        self.name: str = name
        self.display_type: Display_Type = display_type

        self.history = DataHistory(history_size, column_names)

    # Data msg: <name>:<time>, <value>
    # Init msg: <name>, <graph1>, <graph2>:<name>, <graph1>:<name>, <graph2> ...

    def build_packet(self) -> str:
        history: {} = self.history.__dict__()
        packet = {
            "tag" : "data",
            self.name : history
        }

        return json.dumps(packet)

    def update(self, data_line: []) -> None:
        self.history.push(data_line)
        FrontEnd.broadcast_message(self.build_packet())
