import { Empty, Result, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCartItems,
  removeFromCart,
  onSuccessBuy,
} from "../../../_actions/user_actions";
import Paypal from "../../utils/Paypal";
import UserCardBlock from "./Sections/UserCardBlock";

function CartPage(props) {
  const [Total, setTotal] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);
  const [ShowSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let cartItems = [];

    //리덕스 User state안에 cart 안에 상품이 들어있는지 확인
    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });

        dispatch(getCartItems(cartItems, props.user.userData.cart)).then(
          (response) => {
            calculateTotal(response.payload);
          }
        );
      }
    }
  }, [props.user.userData, dispatch]);

  let calculateTotal = (cartDetail) => {
    let total = 0;
    cartDetail.map((item) => {
      total += parseInt(item.price, 10) * item.quantity;
    });

    setTotal(total);
    setShowTotal(true);
  };

  let removeCartItem = (productId) => {
    dispatch(removeFromCart(productId)).then((response) => {
      if (response.payload.productInfo.length <= 0) {
        setShowTotal(false);
      }
    });
  };

  const transactionSuccess = (data) => {
    dispatch(
      onSuccessBuy({
        paymentData: data,
        cartDetail: props.user.cartDetail,
      })
    ).then((response) => {
      if (response.payload.success) {
        setShowTotal(false);
        setShowSuccess(true);
      }
    });
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>
      <div>
        <UserCardBlock
          products={props.user.cartDetail}
          removeItem={removeCartItem}
        />
      </div>

      {ShowTotal ? (
        <div style={{ marginTop: "3rem" }}>
          <h2>Total Amount : $ {Total}</h2>
        </div>
      ) : ShowSuccess ? (
        <Result
          status="success"
          title="구매가 성공적으로 이뤄졌습니다!"
          extra={[
            <Button type="primary" key="console">
              결제 내역 확인
            </Button>,
            <Button key="buy">다른 상품 보러가기</Button>,
          ]}
        />
      ) : (
        <>
          <br />
          <Empty description={false} />
        </>
      )}

      {ShowTotal && <Paypal total={Total} onSuccess={transactionSuccess} />}
    </div>
  );
}

export default CartPage;
