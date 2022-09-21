# Energy meter

I used this package to read the energy meter of my house. The meter is a [Landis+Gyr E350](https://www.landisgyr.com/landis-gyr/products/energy-meters/e350/).

The meter is connected to a Raspberry Pi 4 using a P1 cable (like [this one](https://www.sossolutions.nl/slimme-meter-kabel))

It reads the data through the Serialport library and parses the data using the [P1 protocol](https://www.netbeheernederland.nl/_upload/Files/Slimme_meter_15_a727fce1f1.pdf) (see 6.12 - Representation of P1 telegram).

I haven't implemented everything yet, but I'm working on it.

## Build

```bash
$ yarn
$ yarn release
$ npm run start
```

The following environment variables are used:

- `MQTT_HOST` - The host of the MQTT broker, default is `mqtt` (I used this in a docker-compose file)
- `MQTT_TOPIC` - The topic to publish the data to, default is `energy`
- `TARIEF_NORMAAL` - The normal tariff (should be a floating point in €/kWh) (optional, I calculate this in a separate process)
- `TARIEF_DAL` - The low tariff (should be a floating point in €/kWh) (optional, I calculate this in a separate process)
- `SERVER_PORT` - The port to run the server on, default is `3000`

## License

The MIT License (MIT)

Copyright © Jelte Lagendijk 2022. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
