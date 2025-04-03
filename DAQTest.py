import spidev
import time

# Initialize SPI bus
spi = spidev.SpiDev()
spi.open(0, 0)  # Open SPI bus 0, device (CE0)
spi.max_speed_hz = 50000  # Set SPI speed (Hz)
spi.mode = 0b01  # SPI mode 1: CPOL=0, CPHA=1

# ADS124S08 command definitions
WAKEUP = [0x02]  # Wake-up command
RESET = [0x06]  # Reset command
START = [0x08]  # Start conversion command
STOP = [0x0A]  # Stop conversion command
RDATA = [0x12, 0x00, 0x00, 0x00]  # Read data command

def send_command(command):
    """Send a command to the ADS124S08 and receive the response."""
    response = spi.xfer2(command)
    time.sleep(0.1)  # Wait for the command to be processed
    return response

def read_data():
    """Read data from the ADS124S08."""
    send_command(WAKEUP)  # Wake up the device
    time.sleep(0.1)
    send_command(RESET)  # Reset the device
    time.sleep(0.1)
    send_command(START)  # Start a conversion
    time.sleep(0.1)
    response = spi.xfer2(RDATA)  # Read data
    # The ADS124S08 returns a 3-byte data word
    data = (response[1] << 16) | (response[2] << 8) | response[3]
    return data

try:
    while True:
        data = read_data()
        print(f"ADC Data: {data}")
        time.sleep(1)
except KeyboardInterrupt:
    print("Program terminated.")
finally:
    spi.close()