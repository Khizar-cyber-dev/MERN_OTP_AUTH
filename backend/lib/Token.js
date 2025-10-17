import jwt from 'jsonwebtoken';

export const generateToken = async (id) => {
    const accesToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
    return { accesToken, refreshToken };
}

export const verifyToken = (token, type = 'access') => {
   try{
     const secret = type === 'access' ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
     return jwt.verify(token, secret);
   }catch(err){
    console.log(err)
   }
}