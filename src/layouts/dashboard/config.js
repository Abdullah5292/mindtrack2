import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import BuildingLibraryIcon from "@heroicons/react/24/solid/BuildingLibraryIcon";
import PuzzlePieceIcon from "@heroicons/react/24/solid/PuzzlePieceIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/solid/ArrowLeftOnRectangleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/solid/QuestionMarkCircleIcon";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Overview",
    path: "/",
    requires: [],
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Users",
    path: "/users",
    requires: ["user-view"],
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Institutions",
    path: "/institutions",
    requires: ["institutions-view"],
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Games",
    path: "/games",
    requires: ["game-view"],
    icon: (
      <SvgIcon fontSize="small">
        <PuzzlePieceIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Questions",
    path: "/questions",
    requires: ["questions-view"],
    icon: (
      <SvgIcon fontSize="small">
        <QuestionMarkCircleIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Roles",
    path: "/roles",
    requires: ["role-view"],
    icon: (
      <SvgIcon fontSize="small">
        <UserGroupIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Players",
    path: "/players",
    requires: [],
    icon: (
      <SvgIcon fontSize="small">
        <UserCircleIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Dummy Players",
    path: "/dummy-players",
    requires: [],
    icon: (
      <SvgIcon fontSize="small">
        <UserCircleIcon />
      </SvgIcon>
    ),
  },
  // {
  //   title: "Settings",
  //   path: "/settings",
  //   requires: [],
  //   icon: (
  //     <SvgIcon fontSize="small" sx={{ color: iconColor }}>
  //       <CogIcon />
  //     </SvgIcon>
  //   ),
  // },
];
