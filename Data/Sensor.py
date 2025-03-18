from typing import Callable
from Data import ADC


class Sensor:

    def __init__(self,
                 adcName: str,
                 conversion_function: Callable[[float], float],
                 filepath: str,
                 adc: ADC.ADC,
                 ADCInputNum: int,

                 displayStrategy: Callable[[float], None],
                 saveStrategy: Callable[[str, float], None]
                 ):

        self.adcName: str = adcName
        self.conversion_function: Callable[[float], float] = conversion_function
        self.filepath: str = filepath
        self.adc: ADC.ADC = adc
        self.ADCInputNum: int = ADCInputNum

        self.displayStrategy: Callable[[float], None] = displayStrategy
        self.saveStrategy: Callable[[str, float], None] = saveStrategy



    def update(self) -> None:
        voltage: float = self.adc.read_voltage(self.ADCInputNum)
        value: float = self.conversion_function(voltage)

        self.saveStrategy(self.filepath, value)
        self.displayStrategy(value)
