# import random
# import abc
#
# try:
#     import spidev as spi
#     spi = spidev.SpiDev()
# except ModuleNotFoundError:
#     spi = None
#
#
# class ADC(abc.ABC):
#     """Abstract class which defines an ADC."""
#
#     def __init__(self, bus_num: int, device_num: int, baud_rate: int, polarity: int, phase: int):
#         """
#         Initializes the abstract ADC class.
#         :param bus_num: The spi bus the ADC is on.
#         :param device_num: The device number of the ADC on the SPI bus.
#         :param baud_rate: The baud rate of the SPI bus.
#         :param polarity: The polarity of the SPI bus.
#         :param phase: The phase of the SPI bus.
#         """
#         self.bus_num: int = bus_num
#         self.device_num: int = device_num
#         if spi is not None:
#             spi.open(bus_num, device_num)
#             spi.max_speed_hz = baud_rate
#             spi.mode = (polarity << 1) | phase
#
#     @abc.abstractmethod
#     def set_input_enabled(self, input_num: int, enabled: bool) -> None:
#         """
#         Enables or disables a specific input of the ADC.
#         :param input_num: The number of the target ADC input.
#         :param enabled: The enabled state to set for the target ADC input.
#         :except ValueError: Raised if the given input number is invalid.
#         :except RuntimeError: Raised if the operation was unsuccessful.
#         """
#
#     @abc.abstractmethod
#     def get_input_enabled(self, input_num: int) -> bool:
#         """
#         Determines if the specified ADC input is enabled.
#         :param input_num: The number of the target ADC input.
#         :return bool: True if the input is enabled, false otherwise.
#         :except ValueError: Raised if the given input number is invalid.
#         :except RuntimeError: Raised if the operation was unsuccessful.
#         """
#
#     @abc.abstractmethod
#     def read_voltage(self, input_num: int) -> float:
#         """
#         Reads the voltage of the specified ADC input.
#         :param input_num: The ADC input number to read from.
#         :return float: The current voltage of the specified ADC input.
#         """
#
# # ADS124S06 ADC class
# class ADS124S06(ADC):
#     # SPI configuration constants
#     __BAUD_RATE__ = 1000000
#     __POLARITY__ = 0
#     __PHASE__ = 0
#
#     # Register/Device reference constants
#     __RDATA_COMMAND__ = 0x12
#
#     def __init__(self, bus_num: int, device_num: int):
#         """
#         ADS124S06 ADC constructor.
#         bus_num    -- SPI bus number.
#         device_num -- SPI device (chip select) number.
#         """
#         super().__init__(
#             bus_num=bus_num,
#             device_num=device_num,
#             baud_rate=self.__BAUD_RATE__,
#             polarity=self.__POLARITY__,
#             phase=self.__PHASE__
#         )
#
#     def set_enabled(self, enabled: bool) -> None:
#         pass
#
#     def get_enabled(self) -> bool:
#         pass
#
#     def read_voltage(self, input_num: int) -> float:
#         """
#         Reads the voltage of the specified input channel.
#         input_num -- The input channel number (0-7).
#         """
#         if spi is not None:
#             # Issue the RDATA command (0x12) and send three dummy bytes.
#             tx = [self.RDATA_COMMAND, 0x00, 0x00, 0x00]
#             rx = self.spi.xfer2(tx)
#
#             # Assume the first byte is a status/dummy and the next three bytes contain the ADC data.
#             raw_bytes = rx[1:4]
#             raw_value = (raw_bytes[0] << 16) | (raw_bytes[1] << 8) | raw_bytes[2]
#
#             # Sign extend the 24-bit value if necessary.
#             if raw_value & 0x800000:
#                 raw_value -= 1 << 24
#
#             # Convert the ADC code to a voltage.
#             # For a 24-bit ADC (two's complement), the positive full-scale is 2^(23)-1.
#             Vref = 2.5  # Set your actual reference voltage here if different
#             voltage = (raw_value / (2 ** 23 - 1)) * Vref
#
#             return voltage
#         else:
#             return random.uniform(0, 10)