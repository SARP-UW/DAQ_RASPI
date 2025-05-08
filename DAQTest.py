import spidev
import RPi.GPIO as GPIO
import time

# --- Configuration ----------------------------------
CS_PIN = 17  # BCM pin for CS
SPI_BUS = 0
SPI_DEVICE = 0

# --- GPIO setup for manual CS ----------------------
GPIO.setmode(GPIO.BCM)
GPIO.setup(CS_PIN, GPIO.OUT)
GPIO.output(CS_PIN, GPIO.HIGH)

# --- SPI setup -------------------------------------
spi = spidev.SpiDev()
spi.open(SPI_BUS, SPI_DEVICE)
spi.mode = 0b01  # CPOL=0, CPHA=1 (Mode 1)
spi.max_speed_hz = 10000
spi.no_cs = True  # disable kernel CS so we can bit-bang it


def read_register(start_reg, num_regs=1):
    """
    Read `num_regs` registers starting at `start_reg` from the ADS124S08.

    Returns a list of `num_regs` byte values.
    """
    # RREG command byte: 001r rrrr → 0x20 | (start_reg & 0x1F)
    cmd = 0x20 | (start_reg & 0x1F)
    # second byte: number of registers to read minus one
    count = (num_regs - 1) & 0xFF

    # build the transfer packet: [RREG, count, dummy…]
    packet = [cmd, count] + [0xFF] * num_regs

    GPIO.output(CS_PIN, GPIO.LOW)  # assert CS
    resp = spi.xfer2(packet)  # full-duplex transfer
    GPIO.output(CS_PIN, GPIO.HIGH)  # de-assert CS

    # resp[0] & resp[1] are dummy echoes; actual data starts at resp[2]
    return resp[2:]


# --- Example: read the Device ID register (address 0x00) ---
device_id = read_register(0x00)[0]
print(f"Device ID = 0x{device_id:02X}") 