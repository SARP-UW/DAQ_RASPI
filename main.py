# External imports
import threading
from pathlib import Path
from typing import Callable
import time
from functools import partial

# Internal imports
import Website.Frontend as frontend
from Data.Sensor import Sensor
from Data.DataLogger import DataLogger
from Data.DisplayManager import DisplayManager

def main() -> None:
    conversion_func: Callable[[float], float] = lambda x: x % 10
    data_logger = DataLogger(Path("logs/"))
    display_manager = DisplayManager(3)

    sensors = {
            Sensor("test1", "log1", 2, conversion_func, 0),
            Sensor("test2", "log2", 0, conversion_func, 0),
            Sensor("test3", "log2", 1, conversion_func, 0)
            }

    thread = threading.Thread(target=frontend.start_flask, daemon=True)
    thread.start()

    while True:
        cur_time = time.time();
        for sensor in sensors:
            result = sensor.read_val()
            data_logger.log(sensor.logfile, cur_time, result)
            display_manager.display(sensor.display_ind, cur_time, result)

        time.sleep(0.1)


if __name__ == '__main__':
    main()
