import bcrypt from 'bcrypt'
const saltRaound = 10;
const HashPassword = async(plainPassword: string): Promise<string> => {
    const salt = await bcrypt.genSalt(saltRaound);
    const hashedPassword = await bcrypt.hash(plainPassword,salt)
    return hashedPassword
};

export default HashPassword;