import time
import spidev
import RPi.GPIO as GPIO

# SPI and GPIO setup
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1000000
spi.mode = 0x01
spi.no_cs = True  # we'll handle CS manually

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)  # CS
GPIO.setup(27, GPIO.OUT)  # START
GPIO.setup(22, GPIO.IN)   # DRDY

# CS and START initial states
GPIO.output(17, GPIO.HIGH)
GPIO.output(27, GPIO.LOW)
time.sleep(0.2)

# Register write: set INPMUX to AIN0-AIN1 and PGA gain to 1
GPIO.output(17, GPIO.LOW)
spi.xfer2([0x40, 0x01, 0x01, 0x00])  # WREG to reg 0, write 2 registers
GPIO.output(17, GPIO.HIGH)
time.sleep(0.1)

# Send START command (or just hold START pin HIGH)
GPIO.output(17, GPIO.LOW)
spi.xfer2([0x08])  # START
GPIO.output(17, GPIO.HIGH)
GPIO.output(27, GPIO.HIGH)

time.sleep(0.1)

while True:
    while not GPIO.input(22):
        pass  # wait for DRDY low

    GPIO.output(17, GPIO.LOW)
    result = spi.xfer2([0x12, 0x00, 0x00, 0x00])  # RDATA
    GPIO.output(17, GPIO.HIGH)

    raw = (result[1] << 16) | (result[2] << 8) | result[3]

    # Handle sign extension for 24-bit signed value
    if raw & 0x800000:
        raw -= 1 << 24

    print(raw)
    time.sleep(0.1)