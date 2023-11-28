const { SerialPort } = require('serialport')
const Readline = require('@serialport/parser-readline');
const { ReadlineParser } = require('@serialport/parser-readline')


SerialPort.list().then((value) => console.log(value))

const port = new SerialPort({ path: '/dev/ttyACM1', baudRate: 9600 })


port.write('Hello!')

// Read data that is available but keep the stream from entering //"flowing mode"
port.on('readable', function () {
    port.read();
    port.write("Radek")
    port.write('\n')
});

port.on('data', function (data) {

});

const parser = port.pipe(new ReadlineParser())

// const lineStream = port.pipe(new Readline())

parser.on('data', (value) => console.log(value))