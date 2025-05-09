import threading
from typing import Callable
from Data.Sensor import Sensor
import Website.Frontend as frontend
from Data.Display import Display, Display_Type
import time
from functools import partial
import Data.Collection


def saveStrategy(filepath: str, value: float) -> None:
    with open(filepath, "a") as file:
        file.write(str(time.time()) + ", " + str(value) + "\n")



def main() -> None:
    conversion_func: Callable[[float], float] = lambda x: x

    testSensor1: Sensor = Sensor(
        "test1",
      conversion_func,
        0,

        Display("test1", Display_Type.LINE_CHART, 1, ["timestamp", "value"]),
        partial(saveStrategy, "logs/testsensor1.txt")
    )

    testSensor2: Sensor = Sensor(
        "test2",
        conversion_func,
        0,

        Display("test2", Display_Type.LINE_CHART, 1, ["timestamp", "value"]),
        partial(saveStrategy, "logs/testsensor2.txt")
    )

    testSensor3: Sensor = Sensor(
        "test3",
        conversion_func,
        0,

        Display("test3", Display_Type.LINE_CHART, 1, ["timestamp", "value"]),
        partial(saveStrategy, "logs/testsensor3.txt")
    )

    testSensor4: Sensor = Sensor(
        "test4",
        conversion_func,
        0,

        Display("test4", Display_Type.LINE_CHART, 1, ["timestamp", "value"]),
        partial(saveStrategy, "logs/testsensor4.txt")
    )

    testSensor5: Sensor = Sensor(
        "test5",
        conversion_func,
        0,

        Display("test5", Display_Type.LINE_CHART, 1, ["timestamp", "value"]),
        partial(saveStrategy, "logs/testsensor5.txt")
    )

    thread = threading.Thread(target=frontend.start_flask, daemon=True)
    thread.start()

    try:
        while True:
            testSensor1.update(time.time())
            time.sleep(0.05)
            testSensor2.update(time.time())
            time.sleep(0.05)
            testSensor3.update(time.time())
            time.sleep(0.05)
            testSensor4.update(time.time())
            time.sleep(0.05)
            testSensor5.update(time.time())
            time.sleep(0.05)
    finally:
        Data.Collection.shutdown_DAQ()


if __name__ == '__main__':
    main()