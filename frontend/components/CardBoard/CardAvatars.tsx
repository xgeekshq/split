import React, { useCallback, useMemo } from "react";
import Avatar from "../Primitives/Avatar";
import { bubbleColors } from "../../styles/colors/bubble.colors";
import Flex from "../Primitives/Flex";
import { User } from "../../types/user/user";
import { TeamUserRoles } from "../../utils/enums/team.user.roles";
import { BoardUserRoles } from "../../utils/enums/board.user.roles";

type ListUsersType = {
  user: User;
  role: TeamUserRoles | BoardUserRoles;
  _id: string;
};

type CardAvatarProps = {
  listUsers: ListUsersType[];
  responsible: boolean;
  teamAdmins: boolean;
  userId: string;
  myBoards?: boolean;
};

const CardAvatars = React.memo<CardAvatarProps>(
  ({ listUsers, teamAdmins, userId, responsible, myBoards }) => {
    const data = useMemo(() => {
      if (responsible)
        return listUsers.filter((user) => user.role === "responsible").map((user) => user.user);

      if (teamAdmins)
        return listUsers.filter((user) => user.role === "admin").map((user) => user.user);

      return listUsers.reduce((acc: User[], userFound: ListUsersType) => {
        if (userFound.user._id === userId) {
          acc.unshift(userFound.user);
        } else {
          acc.push(userFound.user);
        }
        return acc;
      }, []);
    }, [listUsers, responsible, teamAdmins, userId]);

    const usersCount = data.length;

    const getInitials = useCallback(
      (user: User | undefined, index) => {
        if (usersCount - 1 > index && index > 1) {
          return `+${usersCount - 2}`;
        }
        return user ? `${user.firstName[0]}${user.lastName[0]}` : "--";
      },
      [usersCount]
    );

    const getRandomColor = useCallback(() => {
      const keys = Object.keys(bubbleColors);
      const value = Math.floor(Math.random() * keys.length);
      return { bg: `$${keys[value]}`, fontColor: `$${bubbleColors[keys[value]]}` };
    }, []);

    const renderAvatar = useCallback(
      (initials, idx) => {
        return (
          <Avatar
            key={`${initials}-${idx}-${Math.random()}`}
            css={{ position: "relative", ml: idx > 0 ? "-7px" : 0 }}
            size={32}
            colors={getRandomColor()}
            fallbackText={initials}
          />
        );
      },
      [getRandomColor]
    );

    return (
      <Flex align="center" css={{ height: "fit-content", overflow: "hidden" }}>
        {data.slice(0, !myBoards ? 3 : 1).map((user: User, index: number) => {
          return renderAvatar(getInitials(user, index), index);
        })}
      </Flex>
    );
  }
);

export default CardAvatars;
