import { Button, Divider, Form, Input, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { callLogin, callLoginWithGoogle } from "config/api";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import styles from "styles/auth.module.scss";
import { useAppSelector } from "@/redux/hooks";
import { GooglePlusOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const callback = params?.get("callback");

  useEffect(() => {
    //đã login => redirect to '/'
    if (isAuthenticated) {
      // navigate('/');
      window.location.href = "/";
    }
  }, []);

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await callLogin(username, password);
    setIsSubmit(false);
    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(setUserLoginInfo(res.data.user));
      message.success("Đăng nhập tài khoản thành công!");
      window.location.href = callback ? callback : "/";
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const { data } = await axios(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse?.access_token}`,
          },
        }
      );
      if (data && data.email) {
        const res = await callLoginWithGoogle("GOOGLE", data.email);

        if (res?.data) {
          setIsSubmit(true);
          dispatch(setUserLoginInfo(res.data.user));
          localStorage.setItem("access_token", res.data.access_token);
          message.success("Đăng nhập tài khoản thành công!");
          console.log(data.email);
          window.location.href = callback ? callback : "/";
        } else {
          notification.error({
            message: "login error !",
            description:
              res.message && Array.isArray(res.message) ? res.message : null,
            duration: 5,
          });
        }
      }
    },
  });

  return (
    <div className={styles["login-page"]}>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.wrapper}>
            <div>
              <h2 style={{ display: "flex", justifyContent: "center" }}>
                Đăng Nhập
              </h2>
              <Divider />
            </div>
            <Form
              name="basic"
              // style={{ maxWidth: 600, margin: '0 auto' }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Đăng nhập
                  </Button>
                </div>
              </Form.Item>
              <Divider>Or</Divider>
              <div
                onClick={() => loginWithGoogle()}
                title="Đăng nhập với tài khoản Google"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  textAlign: "center",
                  marginBottom: 25,
                  cursor: "pointer",
                }}
              >
                Đăng nhập với
                <GooglePlusOutlined style={{ fontSize: 30, color: "orange" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <p className="text text-normal">
                  Chưa có tài khoản ?
                  <span>
                    <Link to="/register"> Đăng Ký </Link>
                  </span>
                </p>
              </div>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
