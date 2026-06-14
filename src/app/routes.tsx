import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./Root";
import {
  SplashScreen,
  LandingScreen,
  LoginScreen,
  ForgotPasswordScreen,
  StepLanguage,
  StepUsername,
  StepPassword,
  StepGender,
  StepAge,
  StepWeightHeight,
  StepGoal,
  StepHealth,
  StepFitness,
  StepComplete,
  MainScreen,
  SettingsScreen,
  WorkoutsScreen,
  PointsScreen,
  SummaryScreen,
  HistoryScreen,
  MealHistoryScreen,
  SocialScreen,
  NutritionScreen,
  CharacterScreen,
  WorkoutSummaryScreen,
  WorkoutActiveScreen,
  PhoneAuthScreen,
  LeaderboardStreak,
  DailyGoals,
  JoinedActivitiesScreen
} from "./screens";

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/",
        Component: SplashScreen,
      },
      {
        path: "/splash",
        Component: SplashScreen,
      },
      {
        path: "/landing",
        Component: LandingScreen,
      },
      {
        path: "/forgot-password",
        Component: ForgotPasswordScreen,
      },
      {
        path: "/login",
        Component: LoginScreen,
      },
      {
        path: "/phone-auth",
        Component: PhoneAuthScreen,
      },
      {
        path: "/language",
        Component: StepLanguage,
      },
      {
        path: "/settings",
        Component: SettingsScreen,
      },
      {
        path: "/points",
        Component: PointsScreen,
      },
      {
        path: "/workouts",
        Component: WorkoutsScreen,
      },
      {
        path: "/workout-active",
        Component: WorkoutActiveScreen,
      },
      {
        path: "/social",
        Component: SocialScreen,
      },
      {
        path: "/nutrition",
        Component: NutritionScreen,
      },
      {
        path: "/joined-activities",
        Component: JoinedActivitiesScreen,
      },
      {
        path: "/meal-history",
        Component: MealHistoryScreen,
      },
      {
        path: "/history",
        Component: HistoryScreen,
      },
      {
        path: "/workout-summary/:workoutId",
        Component: WorkoutSummaryScreen,
      },
      {
        path: "/summary",
        Component: SummaryScreen,
      },
      {
        path: "/questionnaire",
        children: [
          {
            path: "language",
            Component: StepLanguage,
          },
          {
            path: "username",
            Component: StepUsername,
          },
          {
            path: "password",
            Component: StepPassword,
          },
          {
            path: "gender",
            Component: StepGender,
          },
          {
            path: "age",
            Component: StepAge,
          },
          {
            path: "weight-height",
            Component: StepWeightHeight,
          },
          {
            path: "health",
            Component: StepHealth,
          },
          {
            path: "goal",
            Component: StepGoal,
          },
          {
            path: "fitness",
            Component: StepFitness,
          },

          {
            path: "complete",
            Component: StepComplete,
          },
          {
            index: true,
            element: <Navigate to="/questionnaire/language" replace />,
          }
        ]
      },
      {
        path: "/character",
        Component: CharacterScreen,
      },
      {
        path: "/main",
        Component: MainScreen,
      },
      {
        path: "/leaderboard-streak",
        Component: LeaderboardStreak,
      },
      {
        path: "/daily-goals",
        Component: DailyGoals,
      },
    ]
  }
]);
