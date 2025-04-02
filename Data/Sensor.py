from typing import Callable
import random
from Data.Display import Display

class Sensor:
    def __init__(self,
                 name: str,
                 logfile: str,
                 display_ind: int,
                 conversion_function: Callable[[float], float],
                 ADCInputNum: int,
                 ):
        self.name:str = name
        self.logfile: str = logfile
        self.display_ind: int = display_ind
        self.conversion_function: Callable[[float], float] = conversion_function
        self.ADCInputNum: int = ADCInputNum

    def read_val(self) -> float:
        voltage: float = random.randint(0, 10)
        value: float = self.conversion_function(voltage)

        return value
