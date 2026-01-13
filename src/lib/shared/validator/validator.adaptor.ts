import {z, ZodError} from 'zod'

// region validation adaptor

class ZodAdaptor{
    /**
     * validation incoming data against a zod schema
     * @param schema zod schema object
     * @param data data to validate
     * @returns parsed and validated data
     * @throws validationError if validation fails
     */
    static validate <T>(schema:z.ZodSchema<T>,data:unknown): T {
        try {
            return schema.parse(data)
        } catch (error) {
            if(error instanceof ZodError){
                throw new ValidationError('Validation Failed',error.errors)
            }
            throw error;
            
        }

    }
}


/**
 * custom validation error
 * @param message
 * @param details
 */
// region custom validation error;
class ValidationError extends Error{
    name:string;
    details:z.ZodIssue[];
    
    constructor(message:string,details:z.ZodIssue[]){
        super(message);
        this.name = 'ValidationError',
        this.details = details;
    }
}

export default ZodAdaptor;
export {ValidationError}