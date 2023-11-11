const Minio = require('minio')

const minioClient = new Minio.Client({
    endPoint:'host.docker.internal',
    port: 9000,
    useSSL: false,
    accessKey: 'y7C2mBlkXxD7DdaZomUz',
    secretKey: 'kdDYO0Gq7fTc7ppGiScb5ogccKTYct4VotWLN2H5'
});

module.exports = minioClient;