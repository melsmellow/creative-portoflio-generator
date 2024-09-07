"use client";
import { getAuthorizationToken } from "@/server-action/bucket";
// import { uploadFile } from "@/server-action/bucket";
import Image from "next/image";
import React, { useState } from "react";

type Props = {};

function HomePage({}: Props) {
  const [file, setFiles] = useState<File[]>([]);
  const [fileUrl, setFilesUrl] = useState<string[]>([]);

  const uploadToAPI = async (file: File) => {
    const formData = new FormData();
    const auth = await fetch("/api/file/auth", {
      method: "POST",
    });

    const data = await auth.json();
    console.log("AUTH", data);
    const { token, apiUrl } = data;

    const list = await fetch("/api/file/list", {
      method: "POST",
      body: JSON.stringify({ token, apiUrl }),
    });

    console.log(list);

    formData.append("file", file); // The actual file
    formData.append("name", file.name); // Pass the file name separately

    try {
      const response = await fetch("/api/file/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      console.log("File uploaded successfully:", result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileUpload = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log("uploading");
    file.forEach(async (f) => {
      uploadToAPI(f);
      // console.log(result);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const filesArr = event.target.files;
    const fileArray = [];
    const fileArrayURL = [];

    if (filesArr) {
      for (let i = 0; i < filesArr.length; i++) {
        fileArray.push(filesArr[i]);
        fileArrayURL.push(URL.createObjectURL(filesArr[i]));
      }
    }

    setFilesUrl(fileArrayURL);
    setFiles(fileArray);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange}></input>
      {fileUrl.length > 0 && (
        <div>
          {fileUrl.map((image, idx) => {
            return (
              <Image
                src={image}
                alt="text"
                key={idx}
                width={250}
                height={250}
              />
            );
          })}
        </div>
      )}
      {fileUrl.length > 0 && (
        <button onClick={(e) => handleFileUpload(e)}>upload</button>
      )}
    </div>
  );
}

export default HomePage;
