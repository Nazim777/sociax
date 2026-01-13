// import { cloudinary, UploadApiResponse } from '@/config';
import { cloudinary, UploadApiResponse } from '../../../config';
import { Readable } from 'stream';

class BlobStorageUtils{

    /**
     * upload image directly to cloudinary from a buffer (via multer)
     * @param file - the file object from multer
     * @returns - the url of the uploaded image
     */

    // region upload image file
    static uploadImage = async(file:Express.Multer.File,folder:string):Promise<string>=>{
        try {
            const result:UploadApiResponse = await this.uploadFromBuffer(file.buffer, folder)
            return result.secure_url;
            
        } catch (error:any) {
            console.log(`Error uploading image to cloudinary ${error}`)
            throw new Error('Failed to upload image.')
            
        }
    }

    /**
     * upload a buffer to cloudinary using a readble stream
     * @param buffer - the file buffer to upload
     * @param folder - the target folder in cloudinary
     * @returns cloudinary response
     */
    // region upload from buffer

    private static uploadFromBuffer = (buffer:Buffer, folder:string):Promise<UploadApiResponse>=>{
        return new Promise((resolve,reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder,resource_type:'image'},
                (error,result)=>{
                    if(error) return reject(error);
                    resolve(result as UploadApiResponse)
                }
            );

            // create a readable stream from buffer and pipe to cloudinary
            const readableStream = new Readable();
            readableStream.push(buffer)
            readableStream.push(null);
            readableStream.pipe(uploadStream);

        })

    }


    /**
     * Delete an image from cloudinary using the public id
     * @param imageUrl - the url of the image to delete
     */

    // region delete image
    static deleteImage = async(imageUrl:string):Promise<void>=>{
        try {
            const publicId = BlobStorageUtils.extractPublicId(imageUrl)
            if(!publicId) {

            throw new Error('Invalid image url.')
            }
            await cloudinary.uploader.destroy(publicId)
        } catch (error) {
            console.log(`Error deleting image from cloudinary ${error}`)
            throw new Error("Failed to delete image")            
        }
    }

    /**
     * get image from cloudinary
     * @param publicId - the public id of the image
     * @returns - the url of the fetched image
     */
    // region get image

    static getImage = async(publicId:string):Promise<string>=>{
        try {
            const result = await cloudinary.api.resource(publicId);
        return result.secure_url;
        } catch (error) {
            console.log(`Error fetching image from cloudinary ${error}`)
            throw new Error('Failed to fetch image.')
            
        }
    }

    /**
     * Extract the publicId from cloudinary url
     * @param imageUrl - the url of the image
     * @returns - the public id
     */
     private static extractPublicId(imageUrl: string): string | null {
        try {
            const parts = imageUrl.split('/');
            const filenameWithExtension = parts.pop();
            const folderPath = parts.slice(parts.indexOf('kotka-app')).join('/');
            if (!filenameWithExtension) return null;
            const filename = filenameWithExtension.split('.')[0];
            return `${folderPath}/${filename}`;

        } catch (error: any) {
            console.error('Error extracting public ID:', error.message);
            return null;
        }
    }
}

export default BlobStorageUtils;
