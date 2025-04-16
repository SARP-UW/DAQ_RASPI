import threading
from typing import Callable
from Data.Sensor import Sensor
import Website.Frontend as frontend
from Data.Display import Display, Display_Type
import time
from functools import partial


def saveStrategy(filepath: str, value: float) -> None:
    with open(filepath, "a") as file:
        file.write(str(time.time()) + ", " + str(value) + "\n")

def generateSensors() -> [Sensor]:
    conversion_func: Callable[[float], float] = lambda x: x % 10

    return [
        Sensor(
            "test1",
            conversion_func,
            0,

            Display("test1", Display_Type.LINE_CHART, 1, ["timestamp", "value"]),
            partial(saveStrategy, "logs/testsensor1.txt")
        ),
        Sensor(
            "test2",
            conversion_func,
            0,

            Display("test2", Display_Type.LINE_CHART, 1, ["timestamp", "value"]),
            partial(saveStrategy, "logs/testsensor2.txt")
        ),
        Sensor(
            "test3",
            conversion_func,
            0,

            Display("test3", Display_Type.LINE_CHART, 1, ["timestamp", "value"]),
            partial(saveStrategy, "logs/testsensor2.txt")
        )
    ]

def main() -> None:

    thread = threading.Thread(target=frontend.start_flask, daemon=True)
    thread.start()

    sensors = generateSensors()

    while True:
        for sensor in sensors:
            sensor.update(time.time())
            time.sleep(0.1)


if __name__ == '__main__':
    main()
