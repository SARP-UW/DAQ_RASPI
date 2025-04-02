from typing import Callable
import random
from Data.Display import Display

class Sensor:
    def __init__(self,
                 adcName: str,
                 conversion_function: Callable[[float], float],
                 ADCInputNum: int,

                 display: Display,
                 saveStrategy: Callable[[float], None]
                 ):
        self.adcName: str = adcName
        self.conversion_function: Callable[[float], float] = conversion_function
        self.ADCInputNum: int = ADCInputNum

        self.display: Display = display
        self.saveStrategy: Callable[[float], None] = saveStrategy

    def update(self, time_stamp: float) -> None:
        voltage: float = random.randint(0, 10)
        value: float = self.conversion_function(voltage)

        self.saveStrategy(value)

        data: [] = [str(time_stamp), str(value)]
        self.display.update(data)
