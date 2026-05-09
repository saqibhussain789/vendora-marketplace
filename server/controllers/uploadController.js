import cloudinary from "../utils/cloudinary.js";

const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(buffer);
  });

export const uploadProductImages = async (req, res) => {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({ message: "No image files provided" });
    }

    const uploadedImages = [];

    for (const file of files) {
      const result = await uploadBufferToCloudinary(file.buffer, {
        folder: "ai-marketplace/products",
        resource_type: "image",
      });

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
      });
    }

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("uploadProductImages error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

export const uploadAvatarImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const result = await uploadBufferToCloudinary(file.buffer, {
      folder: "ai-marketplace/users",
      resource_type: "image",
    });

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
      },
    });
  } catch (error) {
    console.error("uploadAvatarImage error:", error);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};