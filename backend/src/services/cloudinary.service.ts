import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import multer from 'multer';

@Injectable()
export class CloudinaryService {


async uploadImage(file: Express.Multer.File){

    return new Promise((resolve,reject)=>{

        v2.uploader.upload_stream(
            {
                folder:"luxe-studio/services"
            },
            (error,result)=>{

                if(error)
                    reject(error);

                else
                    resolve(result);

            }
        )
        .end(file.buffer);

    });

}

}