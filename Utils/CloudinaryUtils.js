import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImage = async (filePath, folder) => {
    try {
        const result = await cloudinary.v2.uploader.upload(filePath, {
            folder: folder,
            ressource_type: "image",
        });

        fs.unlinkSync(filePath);

        return result;
    } catch (error) {

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
}

export const uloadMultipleImages = async (files, folder) => {
    const uploadPromises = files.map(file => uploadImage(file.path, folder));
    return Promise.all(uploadPromises);
};

