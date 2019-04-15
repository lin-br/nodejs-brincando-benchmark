const ExpressFactory = require('./service/factory/ExpressFactory');
const OperariosService = require('./service/OperariosService');
const cpus = require('os').cpus();
const cluster = require('cluster');

class Server {

    static iniciarServidor(vaiUtilizarCluster = true) {
        if (vaiUtilizarCluster === true && cluster.isMaster) {
            OperariosService.iniciarOperarios(cpus);
            Server.configurarMaster();
        } else {
            ExpressFactory.iniciarServidor(process.env.PORT || 3000);
        }
    }

    static configurarMaster() {
        cluster.on('online', (thread) => {
            console.log(`Thread ${thread.process.pid} está online.`);
        });

        cluster.on('exit', (thread, code, signal) => {
            console.log(`Thread PID:${thread.process.pid} foi desligada, com código: ${code} e o sinal:${signal}.`);
            OperariosService.iniciarOperario(cluster.fork());
        });
    }
}

module.exports = Server;