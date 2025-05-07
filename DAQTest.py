import spidev
import RPi.GPIO as GPIO
import time

spi = spidev.SpiDev()
spi.open(0, 0)
spi.mode = 0b01
spi.no_cs = True
spi.max_speed_hz = 500000

CS = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(CS, GPIO.OUT)
GPIO.output(CS, GPIO.HIGH)
time.sleep(0.1)

GPIO.output(CS, GPIO.LOW)
spi.xfer2([0x40, 0x01, 0x01, 0x01, 0x00])  # WREG, start at 0x00, write 2 regs: 0x01, 0x00
GPIO.output(CS, GPIO.HIGH)
time.sleep(0.1)

# Read back
GPIO.output(CS, GPIO.LOW)
result = spi.xfer2([0x20, 0x01, 0x00, 0x00])  # Read 2 bytes
GPIO.output(CS, GPIO.HIGH)

print("INPMUX =", hex(result[2]), "PGA =", hex(result[3]))