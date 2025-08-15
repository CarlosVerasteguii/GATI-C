"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var secret = 'test-secret';
var payload = { id: '123', role: 'ADMIN' };
try {
    var token = jwt.sign(payload, secret, { expiresIn: '1h' });
    console.log('Token generated successfully:', token);
}
catch (error) {
    console.error('Error generating token:', error);
}
