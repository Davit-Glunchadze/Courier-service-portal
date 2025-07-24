import axios from 'axios';

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const CLOUD_NAME = 'dqhrf7nzb';
  const UPLOAD_PRESET = 'unsigned_preset';


  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
    formData
  );

  return response.data.secure_url;
};
