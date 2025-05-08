import spidev
import RPi.GPIO as GPIO
import time

# Pin definitions
CS_PIN   = 17   # manual chip‐select (J3 CS)
DRDY_PIN = 27   # DOUT/DRDY from J3

# SPI setup
spi = spidev.SpiDev()
spi.open(0, 0)
spi.mode        = 0b01       # CPOL=0, CPHA=1
spi.max_speed_hz= 1000000    # 1 MHz is safe (datasheet allows up to 10 MHz) :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
spi.no_cs       = True       # we’ll bit‐bang CS

# GPIO setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(CS_PIN, GPIO.OUT, initial=GPIO.HIGH)
GPIO.setup(DRDY_PIN, GPIO.IN)

def cs_low():
    GPIO.output(CS_PIN, GPIO.LOW)
    # tCSSC ≥ 10 ns, so 1 µs is plenty
    time.sleep(0.000001)

def cs_high():
    # tSCCS ≥ 10 ns
    time.sleep(0.000001)
    GPIO.output(CS_PIN, GPIO.HIGH)

def send_command(cmd):
    """Send a single‐byte command to the ADS124S08."""
    cs_low()
    spi.xfer2([cmd])
    cs_high()

# 1) Stop any previous continuous conversions
send_command(0x11)  # SDATAC :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}

# 2) Configure DATARATE register for continuous mode (MODE=0) at e.g. 50 SPS (DR[3:0]=0011)
#    DATARATE addr = 0x04; reset = 0x14.
#    E.g. 50 SPS + continuous + internal osc + low-latency filter → 0b0011_0000 = 0x30
cs_low()
spi.xfer2([0x40 | 0x04, 0x00, 0x30])  # WREG @04h, 1 reg, value=0x30
cs_high()

time.sleep(0.01)  # let filter reset

# 3) Start continuous conversions
send_command(0x08)  # START :contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}

def read_adc():
    """
    Waits for DRDY to go low, then issues RDATA and reads 3 bytes,
    returning a signed 24-bit integer.
    """
    # 4) Wait for DRDY (active low)
    while GPIO.input(DRDY_PIN):
        pass

    # 5) Issue RDATA and grab 3 data bytes
    cs_low()
    resp = spi.xfer2([0x12, 0xFF, 0xFF, 0xFF])  # RDATA + 3 dummy clocks :contentReference[oaicite:6]{index=6}:contentReference[oaicite:7]{index=7}
    cs_high()

    # resp[1..3] are Data1, Data2, Data3
    raw = (resp[1] << 16) | (resp[2] << 8) | resp[3]
    # sign-extend 24-bit
    if raw & 0x800000:
        raw -= 1 << 24
    return raw

# Demo: print ten readings
while True:
    val = read_adc()
    print(f"ADC = {val}")
    time.sleep(0.1)

# Cleanup
send_command(0x0A)  # STOP conversions :contentReference[oaicite:8]{index=8}:contentReference[oaicite:9]{index=9}
spi.close()
GPIO.cleanup()