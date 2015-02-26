var serialport = require('serialport'),
    q = require('q');

//var SerialPort = serialport.SerialPort;
//var serialPort = new SerialPort('/dev/tty.usbmodem1421', {
//    baudrate: 9600,
//    parser: serialport.parsers.readline('\n')
//}, false);
//
//serialPort.open(function(err) {
//    if (err) {
//        console.log('Failed to open: ' + err);
//    } else {
//        console.log('Opened serial port');
//
//        serialPort.on('data', function(data) {
//            console.log(data);
//        });
//    }
//});

module.exports = {
    connect: function(port, baud) {
        var deferred = q.defer();

        var serialPort = new serialport.SerialPort(port, {
            baudrate: baud,
            parser: serialport.parsers.readline('\n')
        }, false);

        serialPort.open(function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(serialPort);
            }
        });

        return deferred.promise;
    }
};
