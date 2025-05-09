from typing import Callable
import random
from Data.Display import Display
import Collection


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

        if self.adcName == "test5":
            Collection.init_DAQ()

    def update(self, time_stamp: float) -> None:
        voltage = 0
        if self.adcName == "test5":
            voltage = Collection.read_voltage()
        else:
            voltage: float = random.randint(0, 10)

        value: float = self.conversion_function(voltage)

        self.saveStrategy(value)

        data: [] = [str(time_stamp), str(value)]
        self.display.update(data)
