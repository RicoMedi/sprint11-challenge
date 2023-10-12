import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import axiosWithAuth from "../axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);
  
  const reset = true;
  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/");
  };

  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
    setArticles([]);
  };

  const login = ({ username, password }) => {
    const credentials = {
      username: username,
      password: password,
    };
    axios
      .post(loginUrl, credentials)
      .then((res) => {
        setMessage(res.data.message);
        localStorage.setItem("token", res.data.token);
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err.message);
        setMessage("Please Try Again");
        setSpinnerOn(false);
      });
  };

  const getArticles = (reset) => {
    setSpinnerOn(true);

    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        if(!reset){
           setMessage(res.data.message);
        }
        setArticles(res.data.articles);
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true);
    return axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        getArticles(reset);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        setSpinnerOn(false);
        console.error(err);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    setSpinnerOn(true);
    return axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => {
        getArticles(reset);
        setMessage(res.data.message);
        setCurrentArticleId();
        setSpinnerOn(false);
      })
      .catch((err) => {
        setSpinnerOn(false);
        console.error(err);
      });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setSpinnerOn(true);
    
    return axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((res) => {
        getArticles(reset);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.error(err);
        setSpinnerOn(false);
      });
  };


  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  articles={articles}
                  postArticle={postArticle}
                  currentArticleId={currentArticleId}
                  setCurrentArticleId={setCurrentArticleId}
                  updateArticle={updateArticle}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
