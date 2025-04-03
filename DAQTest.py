import spidev
import time

# ADS124S08 Register Addresses
ID_REG = 0x00
STATUS_REG = 0x01
MODE0_REG = 0x02
MODE1_REG = 0x03
MODE2_REG = 0x04
INPMUX0_REG = 0x05
INPMUX1_REG = 0x06
PGA_REG = 0x07
DATA_REG = 0x10
# ... other registers as needed

# ADS124S08 Commands
RREG = 0x20  # Read Register
WREG = 0x40  # Write Register
RDATA = 0x10 # Read Data
SDATAC = 0x11 # Stop Continuous Data Acquisition
RDATAC = 0x12 # Start Continuous Data Acquisition
RESET = 0x06 # Reset the device

# SPI settings
SPI_BUS = 0
SPI_DEVICE = 0
SPI_SPEED = 1000000  # Adjust as needed (1MHz here)

def setup_spi():
    """Initializes the SPI bus."""
    spi = spidev.SpiDev()
    spi.open(SPI_BUS, SPI_DEVICE)
    spi.max_speed_hz = SPI_SPEED
    spi.mode = 0b01  # SPI mode 1 (CPOL=0, CPHA=1)
    return spi

def read_register(spi, address):
    """Reads a register from the ADS124S08."""
    command = RREG | address
    tx_data = [command, 0x00]  # Send command and dummy byte
    rx_data = spi.xfer2(tx_data)
    return rx_data[1]

def write_register(spi, address, value):
    """Writes a value to a register on the ADS124S08."""
    command = WREG | address
    tx_data = [command, value]
    spi.xfer2(tx_data)

def read_data(spi):
    """Reads data from the ADS124S08."""
    tx_data = [RDATA, 0x00, 0x00, 0x00]  # Send read data command and dummy bytes
    rx_data = spi.xfer2(tx_data)
    # Combine the received bytes into a 24-bit integer
    data = (rx_data[1] << 16) | (rx_data[2] << 8) | rx_data[3]
    # Handle negative numbers (24-bit signed)
    if data & 0x800000:
        data -= 0x1000000
    return data

def setup_ads124s08(spi):
    """Configures the ADS124S08."""
    write_register(spi, MODE0_REG, 0x00) #Example configuration, change as needed.
    write_register(spi, MODE1_REG, 0x20) #Example configuration, change as needed.
    write_register(spi, INPMUX0_REG, 0x00) #Example configuration, change as needed.
    write_register(spi, PGA_REG, 0x00) #Example configuration, change as needed.

def main():
    spi = setup_spi()
    try:
        write_register(spi, RESET, 0x00) #Reset the device
        time.sleep(0.1) #wait for reset to complete.
        setup_ads124s08(spi)

        # Example: Read and print the ID register
        device_id = read_register(spi, ID_REG)
        print(f"Device ID: 0x{device_id:02X}")

        # Example: Read data continuously
        write_register(spi, MODE1_REG, 0x22) #Enables continuous conversion mode.
        time.sleep(0.1) #Allow time for conversion to begin.

        for _ in range(10):  # Read 10 samples
            data = read_data(spi)
            print(f"Data: {data}")
            time.sleep(0.1)  # Adjust delay as needed

        write_register(spi, MODE1_REG, 0x20) #Disable continuous conversion.
        spi.close()

    except KeyboardInterrupt:
        print("Program terminated by user.")
        spi.close()

if __name__ == "__main__":
    main()