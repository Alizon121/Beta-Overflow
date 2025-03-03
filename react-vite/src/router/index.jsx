import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import AllQuestionsPage from '../components/AllQuestionsPage';
import QuestionFormPage from '../components/QuestionFormPage';
import UserQuestionsPage from '../components/UserQuestionsPage';
import UserCommentsPage from '../components/UserCommentsPage/UserCommentsPage';
import SelectedQuestionPage from '../components/SelectedQuestion';
import QuestionsListPage from '../components/QuestionsList';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <AllQuestionsPage/>,
      },
      {
        path: "/login",
        element: <LoginFormPage />,
      },
      {
        path: "/signup",
        element: <SignupFormPage />,
      },
      {
        path: "/question-form",
        element: <QuestionFormPage/>
      },
      {
        path: "/user-questions",
        element:<UserQuestionsPage/>
      },
      {
        path: "/user-comments",
        element: <UserCommentsPage/>
      },
      {
        path: "/question/:id",
        element: <SelectedQuestionPage/>
      },
      {
        path: "/question-list",
        element: <QuestionsListPage/>
      }
    ],
  },
]);