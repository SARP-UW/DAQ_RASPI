import time
import spidev


spi = spidev.SpiDev()
spi.open(0, 0)

spi.xfer2([0b00001000])

while True:
    recieved = spi.xfer2([0b00010010])
    print(recieved)
    time.sleep(0.1)
