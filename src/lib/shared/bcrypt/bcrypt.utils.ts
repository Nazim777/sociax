import bcrypt from 'bcrypt';

class BcryptUtils {
    private readonly saltRounds:number = Number(process.env.PASSWORD_SALT) ?? 10

    /**
     * Hash password
     * @param password
     * @returns
     */

    public hashPassword = async(password:string):Promise<string>=>{
        const salt = await bcrypt.genSalt(this.saltRounds);
        const hash = await bcrypt.hash(password,salt);
        return hash
    }

    /**
     * compare password
     * @param password
     * @param hash
     * @returns
     */
    public comparePassword = async(password:string,hash:string):Promise<Boolean>=>{
        const isPasswordMatch = await bcrypt.compare(password,hash);
        return isPasswordMatch;
    }

}

export default BcryptUtils;