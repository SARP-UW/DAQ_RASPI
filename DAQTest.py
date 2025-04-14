import time
import spidev


spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1000000
spi.mode = 0x01

spi.xfer2([0b00001010])


while True:
    recieved = spi.xfer2([0b00010010, 0x00, 0x00, 0x00])
    data = (recieved[1] << 16) | (recieved[2] << 8) | recieved[3]
    print(data)
    time.sleep(0.1)
