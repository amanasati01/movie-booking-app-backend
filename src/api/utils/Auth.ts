import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
const SECRET : string = process.env.JWT_SECRET || ''
interface userType {
    email : string
}
export function setUser(user : userType){
    return  jwt.sign({
        email : user.email,
      },SECRET,{
        expiresIn : '7d'
      })

}
export function getUser(token:string):JwtPayload | string | null{
      if(!token){
        return null
      };
      return jwt.verify(token,SECRET)
}
