
from typing import Callable
from Sensor import Sensor
from ADC import ADC, ADS124S06
import time



def saveStrategy(filepath: str, value: float) -> None:
    with open(filepath, "a") as file:
        file.write(str(time.time()) + ", " + str(value) + "\n")


def displayStrategy(value: float) -> None:
    print(value)



def main() -> None:
    conversion_func: Callable[[float], float] = lambda x: x % 10

    adc: ADC = ADS124S06(0, 0)

    testSensor: Sensor = Sensor(
        "test",
        conversion_func,
        "save.txt",
        adc,
        0,

        displayStrategy,
        saveStrategy
    )


    while True:
        testSensor.update()
        time.sleep(1)



if __name__ == '__main__':
    main()
