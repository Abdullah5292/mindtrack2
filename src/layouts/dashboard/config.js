import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import BuildingLibraryIcon from "@heroicons/react/24/solid/BuildingLibraryIcon";
import PuzzlePieceIcon from "@heroicons/react/24/solid/PuzzlePieceIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/solid/ArrowLeftOnRectangleIcon";
import { SvgIcon } from "@mui/material";

const iconColor = "#F3C9D8"; // Default color

export const items = [
  {
    title: "Overview",
    path: "/",
    requires: [],
    icon: (
      <SvgIcon fontSize="small" sx={{ color: iconColor }}>
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Users",
    path: "/users",
    requires: ["user-view"],
    icon: (
      <SvgIcon fontSize="small" sx={{ color: iconColor }}>
        <UsersIcon />
      </SvgIcon>
    ),
  },

  {
    title: "Institutions",
    path: "/institutions",

    requires: ["institution-view"],
    icon: (
      <SvgIcon fontSize="small" sx={{ color: iconColor }}>
        <BuildingLibraryIcon />
      </SvgIcon>
    ),
  },

  {
    title: "Games",
    path: "/games",
    requires: ["games-view"],
    icon: (
      <SvgIcon fontSize="small" sx={{ color: iconColor }}>
        <PuzzlePieceIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Roles",
    path: "/roles",
    requires: ["role-view"],
    icon: (
      <SvgIcon fontSize="small" sx={{ color: iconColor }}>
        <UserGroupIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Players",
    path: "/players",
    requires: [],
    icon: (
      <SvgIcon fontSize="small" sx={{ color: iconColor }}>
        <UserCircleIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Settings",
    path: "/settings",
    requires: [],
    icon: (
      <SvgIcon fontSize="small" sx={{ color: iconColor }}>
        <CogIcon />
      </SvgIcon>
    ),
  },
];
