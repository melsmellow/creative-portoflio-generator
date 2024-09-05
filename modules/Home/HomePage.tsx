"use client";
import { uploadFile } from "@/server-action/bucket";
import Image from "next/image";
import React, { useState } from "react";

type Props = {};

function HomePage({}: Props) {
  const [file, setFiles] = useState<File[]>([]);
  const [fileUrl, setFilesUrl] = useState<string[]>([]);

  const handleFileUpload = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log("uploading");
    file.forEach(async (f) => {
      const result = await uploadFile(f);
      console.log(result);
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
