import random
try:
    import spidev as spi
    spi = spidev.SpiDev()
except ModuleNotFoundError:
    spi = None

class ADC:

    def __init__(self, bus_num: int, device_num: int, baud_rate: int, polarity: int, phase: int):
        self.bus_num: int = bus_num
        self.device_num: int = device_num
        if spi is not None:
            spi.open(bus_num, device_num)
            spi.max_speed_hz = baud_rate
            spi.mode = (polarity << 1) | phase

    def read_voltage(self, input_num: int) -> float:
        return -1

class ADS124S06(ADC):
    __BAUD_RATE__: int = 1000000
    __POLARITY__: int = 0
    __PHASE__: int = 0

    def __init__(self, bus_num: int, device_num: int):
        super().__init__(bus_num, device_num, 1000000, 0, 0)

    def read_voltage(self, input_num: int) -> float:
        if spi is not None:
            spi.open(super().bus_num, super().device_num)
            ...
        else:
            return random.randint(0, 10)













