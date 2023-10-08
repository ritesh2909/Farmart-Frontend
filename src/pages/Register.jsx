import React from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/Context";
import { useState, useContext } from "react";

import { LoginFailure, LoginStart, LoginSuccess } from "../context/Action";
import axios from "axios";
function Register() {
  const { user, isFetching, error, dispatch } = useContext(Context);
  const [internalError, setInternalError] = useState(null);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://attractive-worm-hosiery.cyclic.app/api/auth/register", {
        email: data.email,
        password: data.password,
      });
      window.alert("Successfully Registered!");
      window.location.href = "/";
      console.log(res);
    } catch (error) {
      if (error?.response?.data) {
        setInternalError(error.response.data);
      }
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setInternalError(null);
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-80">
          <div className="row d-flex justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="card-body p-5 text-center">
                  <div className="mb-md-5 mt-md-4 pb-5">
                    <h2 className="fw-bold mb-2">Register</h2>
                    <p className="text-50 mb-5">
                      Please enter your Email and password!
                    </p>
                    <form action="" onSubmit={handleSubmit}>
                      <div className="form-outline form mb-4">
                        <input
                          type="email"
                          id="typeEmailX"
                          className="form-control form-control-lg"
                          placeholder="Email"
                          onChange={handleChange}
                          value={data.email}
                          name="email"
                        />
                      </div>

                      <div className="form-outline form mb-4">
                        <input
                          type="password"
                          id="typePasswordX"
                          className="form-control form-control-lg"
                          placeholder="Password"
                          onChange={handleChange}
                          value={data.password}
                          name="password"
                        />
                      </div>

                      <button
                        className="btn btn-primary btn-lg px-2"
                        type="submit"
                      >
                        Register
                      </button>
                    </form>
                  </div>

                  <div>
                    <p className="mb-0">
                      Already have an account?{" "}
                      <Link to={"/login"} className="text-50 fw-bold">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
