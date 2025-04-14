import time
import spidev
import RPi.GPIO as GPIO



spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1000000
spi.mode = 0x01


GPIO.setmode(GPIO.BCM)
pin_number = 17
GPIO.setup(pin_number, GPIO.OUT)

GPIO.output(pin_number, GPIO.HIGH)
time.sleep(0.2)


GPIO.output(pin_number, GPIO.LOW)
spi.xfer2([0b00001010])
GPIO.output(pin_number, GPIO.HIGH)

while True:

    GPIO.output(pin_number, GPIO.LOW)
    recieved = spi.xfer2([0b00010010, 0x00, 0x00, 0x00])
    GPIO.output(pin_number, GPIO.HIGH)

    data = (recieved[1] << 16) | (recieved[2] << 8) | recieved[3]
    print(data)
    time.sleep(0.1)


