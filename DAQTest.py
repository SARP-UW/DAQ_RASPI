import time
import spidev
import RPi.GPIO as GPIO

# --- Configuration --------------------------------
VREF = 2.5   # external reference voltage in volts
PGA  = 1     # PGA gain setting

# SPI and GPIO setup
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 500000
spi.mode = 0b01
spi.no_cs = True

GPIO.setmode(GPIO.BCM)
CS_PIN    = 17  # CS
START_PIN = 27  # START
DRDY_PIN  = 22  # DRDY

GPIO.setup(CS_PIN, GPIO.OUT, initial=GPIO.HIGH)
GPIO.setup(START_PIN, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(DRDY_PIN, GPIO.IN)

time.sleep(0.2)
GPIO.output(START_PIN, GPIO.HIGH)  # hold START high for continuous

# Configure INPMUX=A0–A1 and PGA=1
GPIO.output(CS_PIN, GPIO.LOW)
spi.xfer2([0x40, 0x01, 0x01, 0x00])  # WREG@00h, write 2 regs: INPMUX=0x01, PGA=0x00
GPIO.output(CS_PIN, GPIO.HIGH)
time.sleep(0.1)

# Send START command
GPIO.output(CS_PIN, GPIO.LOW)
spi.xfer2([0x08])  # START
GPIO.output(CS_PIN, GPIO.HIGH)
time.sleep(0.1)

def read_raw():
    # wait for DRDY → low
    while not GPIO.input(DRDY_PIN):
        pass

    GPIO.output(CS_PIN, GPIO.LOW)
    resp = spi.xfer2([0x12, 0x00, 0x00, 0x00])  # RDATA + 3 dummy
    GPIO.output(CS_PIN, GPIO.HIGH)

    raw = (resp[1] << 16) | (resp[2] << 8) | resp[3]
    # sign-extend 24-bit
    if raw & 0x800000:
        raw -= 1 << 24
    return raw

def raw_to_volts(code):
    # full-scale = ±(VREF / PGA); counts = ±(2^23−1)
    return code * (VREF / PGA) / (2**23 - 1)

# --- Main loop ------------------------------------
while True:
    code = read_raw()
    volts = raw_to_volts(code)
    print(f"Voltage = {volts:.6f} V")
    time.sleep(0.1)