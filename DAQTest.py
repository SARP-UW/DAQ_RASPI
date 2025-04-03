import time
import spidev


spi = spidev.SpiDev()
spi.open(0, 0)

spi.xfer2([0b00001000])

while True:
    recieved = spi.xfer2([0b00010010, 0x00, 0x00, 0x00])
    data = (recieved[1] << 16) | (recieved[2] << 8) | recieved[3]
    print(data)
    time.sleep(0.1)
