import { useState } from "react";

const Companion_Write = () => {
  const [file, setFile] = useState();
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      <h1>Write</h1>
      <p>동행인 게시글 작성 페이지입니다.</p>
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} />
      <img src={file} />
    </div>
  );
};

export default Companion_Write;
