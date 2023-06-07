import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const UploadProfilePicutre = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const userID = cookies.get("USER-ID");
  const [userProfilePicture, setUserProfilePicture] = useState<
    string | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataConfig = {
      method: "GET",
      url: `http://localhost:3000/data/${userID}`,
    };

    axios(dataConfig)
      .then((result) => {
        setUserProfilePicture(result.data.userImage);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error retrieving user data, please try again 😥");
        error = new Error();
      });
  }, [userID]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("upload", selectedFile);

        const response = await axios.post(
          "http://localhost:3000/updatepicture",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response.data);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  return (
    <div className='profile-picture-wrapper'>
      <img
        src={userProfilePicture}
        alt='user'
        className='profile-picture'
        height='50px'
        width='50px'
      />
      <form onSubmit={handleSubmit}>
        <input type='file' onChange={handleFileChange}></input>
        <button type='submit'>submit</button>
      </form>
    </div>
  );
};

export default UploadProfilePicutre;
