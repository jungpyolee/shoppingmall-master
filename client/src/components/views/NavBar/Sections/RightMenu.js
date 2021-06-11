/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, Badge } from "antd";

import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCartOutlined } from "@ant-design/icons";

function RightMenu(props) {
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu style={{ marginTop: 5 }} mode={props.mode}>
        <Menu.Item key="history">
          <a href="/history">결제 이력</a>
        </Menu.Item>
        <Menu.Item key="upload">
          <a href="/upload">업로드</a>
        </Menu.Item>

        <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
          <a href="/user/cart" style={{ marginRight: -22, color: "#667777" }}>
            <ShoppingCartOutlined
              style={{
                fontSize: 25,
                marginBottom: 3,
              }}
            />
          </a>
          <Badge
            count={user.userData && user.userData.cart.length}
            showZero
            style={{ marginLeft: 20, marginTop: -10 }}
          ></Badge>
        </Menu.Item>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>로그아웃</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
