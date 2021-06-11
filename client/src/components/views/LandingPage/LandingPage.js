import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row, Card, Button } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import { continents, price } from "./Section/Datas";
import CheckBox from "./Section/Checkbox";
import RadioBox from "./Section/RadioBox";
import SearchFeature from "./Section/SearchFeature";
const { Meta } = Card;

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [postSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({ continents: [], price: [] });
  const [SearchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };
    getProducts(body);
  }, []);

  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...products, ...response.data.productInfo]);
        } else {
          setProducts(response.data.productInfo);
        }

        setPostSize(response.data.postSize);
      } else {
        alert("상품들을 가져오는데 실패했습니당");
      }
    });
  };

  const loadMoreHandler = () => {
    let skip = Skip + Limit;

    let body = {
      skip: skip,
      limit: Limit,
      loadMore: true,
      filters: Filters,
    };
    getProducts(body);
    setSkip(skip);
  };

  const renderCards = products.map((product, index) => {
    const image = product.images;
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <a href={`/product/${[product._id]}`}>
          <Card cover={<ImageSlider images={image} />}>
            <Meta title={product.title} description={`$${product.price}`} />
          </Card>
        </a>
      </Col>
    );
  });

  const showFilterResults = (filters) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };

    getProducts(body);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;

    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };
  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };

    newFilters[category] = filters;

    console.log("filters", filters);

    if (category === "price") {
      let priceValues = handlePrice(filters);

      newFilters[category] = priceValues;
    }

    showFilterResults(newFilters);
    setFilters(newFilters);
  };

  const updateSearchTerm = (newSearchTerm) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: Filters,
      searchTerm: newSearchTerm,
    };

    setSkip(0);
    setSearchTerm(newSearchTerm);
    getProducts(body);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>Let's Travel Anywhere</h2>
      </div>

      {/* Filter */}

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* Checkbox */}
          <CheckBox
            list={continents}
            handleFilters={(filters) => handleFilters(filters, "continents")}
          ></CheckBox>
        </Col>

        <Col lg={12} xs={24}>
          {" "}
          {/* RadioBox */}
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "price")}
          ></RadioBox>
        </Col>
      </Row>

      {/* Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerm} />
      </div>
      {/* Cards  */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      {postSize >= Limit && (
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button onClick={loadMoreHandler}>더보기</Button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
