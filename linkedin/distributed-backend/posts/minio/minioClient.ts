const Minio = require('minio')

const minioClient = new Minio.Client({
    endPoint:'127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: '3XjVRJmh6BTbwKhmp0hE',
    secretKey: 'vBxpmNsylFUoJEQsyrHl8XOXgbdhTKkaYAdxla40'
});

module.exports = minioClient;