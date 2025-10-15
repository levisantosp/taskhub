import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default class AuthUtils {
    static async hashPassword(pass: string) {
        return await bcrypt.hash(pass, 12)
    }

    static async comparePassword(pass: string, hash: string) {
        return await bcrypt.compare(pass, hash)
    }
    
    static generateToken(payload: string | Buffer | object, secret: string, expiresIn: any) {
        return jwt.sign(payload, secret, { expiresIn })
    }

    static verifyToken(token: string, secret: string) {
        return jwt.verify(token, secret)
    }
}