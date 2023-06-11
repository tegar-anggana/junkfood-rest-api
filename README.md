# REST API for Capstone C23-PS482
This backend is for firestore, firebase auth, and cloud storage interaction. The backend for the junk food ML model is https://github.com/tegar-anggana/flask-c23-ps482.

# Usage steps
1. After cloning this repository, rename the "env" file to .env
2. Edit the .env file:
   - PORT >> The port for this backend app. Example : `PORT="4000"`
   - STORAGE_BUCKET >> The storage bucket url (\<project-name\>.appspot.com). Example : `STORAGE_BUCKET="bangkit-project.appspot.com"`
   - PROJECT_ID >> Project ID on Google Cloud Platform. Example : `PROJECT_ID="bangkit-project"`
   - STORAGE_PUBLIC_URL >> Storage public url for cloud storage bucket. Example : `STORAGE_PUBLIC_URL="https://storage.googleapis.com/bangkit-project.appspot.com"`
3. Go to project settings for the firebase project and download the service account key
   ![image](https://github.com/tegar-anggana/junkfood-rest-api/assets/80917799/22f67c49-b6cf-4c08-9b8d-1349a383f99d)
   ![image](https://github.com/tegar-anggana/junkfood-rest-api/assets/80917799/7fd8d9a3-6978-4c73-ab06-09c95d5a508f)
4. Rename the downloaded file to `"ServiceAccount.json"`
5. Place the file in the `"firebase"` directory of this repository.
   ![image](https://github.com/tegar-anggana/junkfood-rest-api/assets/80917799/71c4812d-031e-443b-a598-6e6b1b72ea84)
7. Run with `npm run dev`
