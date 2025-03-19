import threading
from typing import Callable
from Data.Sensor import Sensor
from Data.ADC import ADC, ADS124S06
import Website.Frontend as frontend
import time



def saveStrategy(filepath: str, value: float) -> None:
    with open(filepath, "a") as file:
        file.write(str(time.time()) + ", " + str(value) + "\n")


def displayStrategy(file_path: str) -> None:
    with open(file_path, 'r') as file:
        file_content = file.read()
        frontend.broadcast_message(file_content)


def main() -> None:
    conversion_func: Callable[[float], float] = lambda x: x % 10

    adc: ADC = ADS124S06(0, 0)

    testSensor: Sensor = Sensor(
        "test",
        conversion_func,
        "Data/save.txt",
        adc,
        0,

        displayStrategy,
        saveStrategy
    )

    thread = threading.Thread(target=frontend.start_flask, daemon=True)
    thread.start()

    while True:
        testSensor.update()
        time.sleep(1)



if __name__ == '__main__':
    main()
