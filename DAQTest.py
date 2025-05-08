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
returned = spi.xfer2([0b00100101, 0b00000001, 0xFF, 0xFF])  # WREG, 2 bytes: INPMUX=1, PGA=0
GPIO.output(CS, GPIO.HIGH)
time.sleep(0.1)

print(returned)

