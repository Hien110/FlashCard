import React from "react";
import { ROUTE_PATH } from "../constants/routePath";
import MainLayout from "../layouts/main-layout";

const Homepage = React.lazy(() => import("../pages/HomePage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const RegisterPage = React.lazy(() => import("../pages/RegisterPage"));
const NewFlashCardPage = React.lazy(() => import("../pages/NewFlashCardPage"));
const FlashCardSubjectPage = React.lazy(() => import("../pages/FlashCardSubjectPage"));
const EditFlashCardPage = React.lazy(() => import("../pages/EditFlashCardPage"));

const AppRoutes = [
  { path: ROUTE_PATH.HOME, page: Homepage, layout: MainLayout },
  { path: ROUTE_PATH.LOGIN, page: LoginPage },
  { path: ROUTE_PATH.REGISTER, page: RegisterPage },
  { path: ROUTE_PATH.NEWFLASHCARD, page: NewFlashCardPage },
  { path: ROUTE_PATH.PLASHCARDSUBJECT, page: FlashCardSubjectPage },
  { path: ROUTE_PATH.EDITFLASHCARD, page: EditFlashCardPage },
];

export default AppRoutes;