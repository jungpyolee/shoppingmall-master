import React from "react";
import { Carousel } from "antd";
function ImageSlider(props) {
  return (
    <div>
      <Carousel>
        {props.images.map((image, index) => {
          return (
            <div key={index}>
              <img
                style={{ width: "100%", maxHeight: "150px" }}
                src={`http://localhost:5000/${image}`}
                alt="이미지"
              ></img>
            </div>
          );
        })}
      </Carousel>{" "}
    </div>
  );
}

export default ImageSlider;
