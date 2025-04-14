import time
import spidev
import RPi.GPIO as GPIO



spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1000000
spi.mode = 0x01


GPIO.setmode(GPIO.BCM)

GPIO.setup(17, GPIO.OUT)
GPIO.setup(27, GPIO.IN)

GPIO.output(17, GPIO.HIGH)
time.sleep(0.2)


GPIO.output(17, GPIO.LOW)
spi.xfer2([0b00001010])
GPIO.output(17, GPIO.HIGH)

while True:
    GPIO.output(17, GPIO.LOW)
    recieved = spi.xfer2([0b00010010, 0x00, 0x00, 0x00])
    GPIO.output(17, GPIO.HIGH)

    data = (recieved[1] << 16) | (recieved[2] << 8) | recieved[3]
    print(data)





