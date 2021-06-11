import React, { useState } from "react";
import { Typography, Button, Form, Input } from "antd";
import FileUpload from "../../utils/FileUpload";
import axios from "axios";
function UploadProductPage(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [continent, setContinent] = useState(1);
  const [images, setImages] = useState([]);
  const continents = [
    { key: 1, value: "Africa" },
    { key: 2, value: "Asia" },
    { key: 3, value: "Europe" },
    { key: 4, value: "North America" },
    { key: 5, value: "South America" },
    { key: 6, value: "Australia" },
    { key: 7, value: "Antarctica" },
  ];

  const titleChangeHandler = (e) => {
    setTitle(e.currentTarget.value);
  };

  const descriptionChangeHandler = (e) => {
    setDescription(e.currentTarget.value);
  };

  const priceChangeHandler = (e) => {
    setPrice(e.currentTarget.value);
  };

  const continentChangeHandler = (e) => {
    setContinent(e.currentTarget.value);
  };
  const { Title } = Typography;
  const { TextArea } = Input;

  const uploadImages = (newImages) => {
    setImages(newImages);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!title || !description || !price || !continent || !images) {
      return alert("모든 값을 넣어주셔야 합니다.");
    }

    //서버에 채운값을 req로보낸다.

    const body = {
      //로그인된 사람의 id

      writer: props.user.userData._id,
      title: title,
      description: description,
      price: price,
      continents: continent,
      images: images,
    };
    axios.post("/api/product/", body).then((response) => {
      if (response.data.success) {
        alert("상품 업로드 성공");
        props.history.push("/");
      } else {
        alert("상품 업로드 실패!");
      }
    });
  };
  return (
    <div style={{ maxWidth: "700px ", margin: "2rem auto" }}>
      <div style={{ textALign: "center", marginBottom: "2rem" }}>
        <Title level={2}>여행 상품 업로드</Title>
      </div>

      <Form onSubmit={submitHandler}>
        {/* Dropzone */}

        <FileUpload refreshFunction={uploadImages}></FileUpload>
        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={title} />
        <br />
        <br />

        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value={description} />
        <br />
        <br />
        <label>가격($)</label>
        <Input
          type="number"
          onChange={priceChangeHandler}
          value={price}
        ></Input>
        <br />
        <br />
        <select onChange={continentChangeHandler} value={continent}>
          {continents.map((continent) => (
            <option key={continent.key} value={continent.key}>
              {continent.value}
            </option>
          ))}
        </select>

        <Button onClick={submitHandler}>업로드</Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
