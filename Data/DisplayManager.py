from Data.Display import Display, Display_Type

class DisplayManager:
    def __init__(self, num_displays: int):
        self.displays = {}
        for i in range(num_displays):
            self.displays[i] = Display(str(i), Display_Type.LINE_CHART, 1, ["timestamp", "value"])

    def display(self, display_ind: int, time: float, value: float) -> None:
        data: [] = [str(time), str(value)]
        self.displays[display_ind].update(data)
