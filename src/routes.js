import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import Login from "./views/Login";
import Inscri from "./views/Inscri";
import Utilisateurs from "./views/Utilisateurs";
import DefaultLayoutLogin from "./layouts/DefaultLogin";
import Fournisseur from "./views/Fournisseur";
import Bons from "./views/Bons";
import DetailsBon from "./views/DetailsBon";
import Caisse from "./views/Caisse";
export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/blog-overview" />
  },
  {
    path: "/login",
    layout: DefaultLayoutLogin,
    component: Login
  },
  {
    path: "/login/:id",
    layout: DefaultLayoutLogin,
    component: Login
  },
  {
    path: "/inscription",
    layout: DefaultLayoutLogin,
    component: Inscri
  },
  {
    path: "/clients",
    layout: DefaultLayout,
    component: Utilisateurs
  },
  {
    path: "/fournisseurs",
    layout: DefaultLayout,
    component: Fournisseur
  },
  {
    path: "/bon",
    layout: DefaultLayout,
    component: Bons
  },
  {
    path: "/bons/:id",
    layout: DefaultLayout,
    component: Bons
  },
  {
    path: "/details/:id",
    layout: DefaultLayout,
    component: DetailsBon
  },
  {
    path: "/caisse",
    layout: DefaultLayout,
    component: Caisse
  },
  {
    path: "/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  }
];
