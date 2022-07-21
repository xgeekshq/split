# **`Stakeholder`**

> **Summary**

- [x] Keep stakeholders on database `teamusers.role === 'stakeholder'`

- [x] Move the route `GET /boards/stakeholders/all` to `GET /teams/:teamId?userTeamRole=stakeholders`

  - [x] Remove route `GET /boards/stakeholders/all`

  - [x] Create route `GET /teams/:teamId` which accepts `loadUsers` and `userTeamRole` query parameters to load and/or filter team users by role

- [x] **`backend`** and **`frontend`** ready to treat **`stakeholder`** from database

> **backend** changes

- [x] **[backend/src/](./backend/src/)**

  - [x] **[dto/](./backend/src/libs/dto/)**

    - [x] **[param/](./backend/src/libs/dto/param/)**

      - [x] [team.params.ts](backend/src/libs/dto/param/team.params.ts): new file
      - [x] [team.query.params.ts](backend/src/libs/dto/param/team.query.params.ts): new file

    - [x] **[enum/](./backend/src/libs/enum/)**

      - [x] [team.roles.ts](./backend/src/libs/enum/team.roles.ts): add **`stakeholder`** role

  - [x] **[libs/](./backend/src/libs/)**

    - [x] **[utils/](./backend/src/libs/utils/)**

      - [x] ~~[ignored_users.json](./backend/src/libs/utils/ignored_users.json)~~: remove file

  - [x] **[modules/](./backend/src/modules/)**

    - [x] **[boards/](./backend/src/modules/boards/)**

      - [x] **[controller/](./backend/src/modules/boards/controller/)**

        - [x] [board.controller.ts](./backend/src/modules/boards/controller/boards.controller.ts): remove **~~`GET boards/stakeholders/all`~~** route

      - [x] **[services/](./backend/src/modules/boards/services/)**

        - [x] [create.board.service.ts](./backend/src/modules/boards/services/create.board.service.ts): refactor to get/filter **`stakeholder`** ref from **`teamUser.role`**

    - [x] **[teams/](./backend/src/modules/teams/)**

      - [x] **[applications/](./backend/src/modules/teams/applications/)**

        - [x] [get.team.application.ts](./backend/src/modules/teams/applications/get.team.application.ts): add **`getTeam(teamId, teamQueryParams)`**

      - [x] **[controller/](./backend/src/modules/teams/controller/)**

        - [x] [team.controller.ts](./backend/src/modules/teams/controller/team.controller.ts): remove **~~`GET teams/member`~~** and add **`GET teams/:teamId?loadUsers&userTeamRole=[member,stakeholder,admin]`** with optional query params: **`loadUsers`** to load all team users and **`userTeamRole`** to load and filter team users by their role in the team in the result

      - [x] **[interfaces/](./backend/src/modules/teams/interfaces/)**

        - [x] **[applications/](./backend/src/modules/teams/interfaces/applications/)**

          - [x] [get.team.application.interface.ts](./backend/src/modules/teams/interfaces/applications/get.team.application.interface.ts): add **`getTeam(teamId, teamQueryParams)`** to the interface

        - [x] **[services/](./backend/src/modules/teams/services/)**

          - [x] [get.team.service.ts](./backend/src/modules/teams/services/get.team.service.ts): **`getTeam(teamId, teamQueryParams)`** to the interface

      - [x] **[schemas/](./backend/src/modules/teams/schemas/)**

        - [x] [team.user.schema.ts](./backend/src/modules/teams/schemas/team.user.schema.ts?plain=1#15): add **`stakeholder`** role

      - [x] **[services/](./backend/src/modules/teams/services/)**

        - [x] [get.team.user.service.ts](./backend/src/modules/teams/services/get.team.user.service.ts?plain=1#15): improve **`getTeam()`** to treat **`teamQueryParams`** accordingly

> **frontend** changes

- [x] **[frontend/src/](./frontend/src/)**

  - [x] **[api/](./frontend/src/api/)**

    - [x] [boardService.tsx](./frontend/src/api/boardService.tsx): remove **~~`getStakeholders()`~~** which fetch data from **`GET /boards/stakeholders/all`** route that was removed from backend

  - [x] **[components/](./frontend/src/components/)**

    - [x] **[Board/](./frontend/src/components/Board/)**

      - [x] **[Header/](./frontend/src/components/Board/Header/)**

        - [x] [index.ts](./frontend/src/components/Board/Header/index.ts): change comparison `stakeholder` instead of using string now it compares with the enum **`BoardUserRoles.STAKEHOLDER`**

    - [x] **[CardBoard/](./frontend/src/components/CardBoard/)**

      - [x] [CardAvatars.tsx](./frontend/src/components/CardBoard/CardAvatars.tsx): change comparison with roles instead of using string now it with the enums **`BoardUserRoles`** and **`TeamUserRoles`**

    - [x] **[CreateBoard/](./frontend/src/components/CreateBoard/)**

      - [x] **[SubTeamsTab/](./frontend/src/components/CreateBoard/SubTeamsTab/)**

        - [x] [MainBoardCard.tsx](./frontend/src/components/CreateBoard/SubTeamsTab/MainBoardCard.tsx): change to get **`stakeholder`** from **`teamUser.role`**

        - [x] [QuickEditSubTeams.tsx](./frontend/src/components/CreateBoard/SubTeamsTab/QuickEditSubTeams.tsx): remove **`stakeholder`** references

        - [x] [TeamSubTeamsConfigurations.tsx](./frontend/src/components/CreateBoard/SubTeamsTab/TeamSubTeamsConfigurations.tsx): change to get **`stakeholder`** from **`teamUser.role`** and try to improve code readability and stop passing **`stakeholder`** as **`props`** to QuickEditSubTeams and MainBoardCard

  - [x] **[hooks/](./frontend/src/hooks/)**

    - [x] [useCreateBoard.tsx](./frontend/src/hooks/useCreateBoard.tsx): remove **~~`stakeholder`~~** function param and compare it from **`teamUsers.role`** instead

  - [x] **[pages/](./frontend/src/pages/)**

    - [x] **[boards/](./frontend/src/pages/boards/)**

      - [x] [new.tsx](./frontend/src/pages/boards/new.tsx): remove **~~`getStakeholder`~~** and **~~`queryClient.prefetchQuery('stakeholders',...)`~~**

> **contributors**

- [x] [.all-contributorsrc](./.all-contributorsrc/): add Geomar as contributor

- [x] [README.md](./README.md/): add Geomar as contributor

## **`Notes`**

> **Find: "[ignored_users.json](./backend/src/libs/utils/ignored_users.json)"**

### [boards.controller.ts](./backend/src/modules/boards/controller/boards.controller.ts)

#### GET /stakeholders~~/all~~ --> removed /all

- Returns all stakeholders (from the file)

### [create.board.service.ts](./backend/src/modules/boards/services/create.board.service.ts)

#### class: CreateBoardServiceImpl

##### Methods

- **saveBoardUsersFromTeam()**: checks if the new user is a stakeholder to set the role
- **splitBoardByTeam()**: filter the team without the stakeholders then split the board in small boards without include the stakeholder

> **Find: "StakeholdersData"**

### [boards.controller.ts](./backend/src/modules/boards/controller/boards.controller.ts)

#### GET /stakeholders~~/all~~ --> removed /all

##### Returns all stakeholders (from the file)

> **Find: "stakeholder"**

> **`backend`**

#### [enum/board.roles.ts](./backend/src/libs/enum/board.roles.ts)

##### Board roles: owner, member, responsible, stakeholder

#### [boards.controller.ts](./backend/src/modules/boards/controller/boards.controller.ts)

#### GET /stakeholders/all

##### Returns all stakeholders (from the file)

#### [board.user.schema.ts](./backend/src/modules/boards/schemas/board.user.schema.ts)

##### Restricts the role field to accept only: owner, member, responsible, stakeholder

#### [create.board.service.ts](./backend/src/modules/boards/services/create.board.service.ts)

#### class: CreateBoardServiceImpl

##### Methods

- **saveBoardUsersFromTeam()**: checks if the new user is a stakeholder to set the role
- **splitBoardByTeam()**: filter the team without the stakeholders then split the board in small boards without include the stakeholder

> **`frontend`**

#### [api/boardService.tsx](./frontend/src/api/boardService.tsx)

##### **getStakeholders()**: GET /boards/stakeholders/all

#### [components/CreateBoard/SubTeamsTab/TeamSubTeamsConfigurations.tsx](./frontend/src/components/CreateBoard/SubTeamsTab/TeamSubTeamsConfigurations.tsx)

##### **TeamSubTeamsConfigurations()**: shows stakeholder's name if there is a stakeholder in the team

#### [pages/boards/new.tsx](./frontend/src/pages/boards/new.tsx)

- ? it prefetch **teams** and **stakeholders** in **getServerSideProps()** but do not use it in this Component ?
- The stakeholder is fetched again in TeamSubTeamsConfigurations, does it uses the pre-fetched stakeholder here?

#### [components/Board/Header/index.tsx](./frontend/src/components/Board/Header/index.tsx)

- Show stakeholder avatar when there is it

#### [components/CardBoard/CardAvatars.tsx](./frontend/src/components/CardBoard/CardAvatars.tsx)

- Show stakeholder avatar when there is it

#### [components/CreateBoard/TipBar.tsx](./frontend/src/components/CreateBoard/TipBar.tsx)

- It just shows info about stakeholder

#### [components/CreateBoard/fake/FakeSettingsTabs](./frontend/src/components/CreateBoard/fake/FakeSettingsTabs/partials/TeamTab/index.tsx)

- It is showed when there is an error

#### [components/CreateBoard/SubTeamsTab](./frontend/src/components/CreateBoard/SubTeamsTab/TeamSubTeamsConfigurations.tsx)

- It shows the stakeholder if it exists (it calls getStakeHolders())

#### [hooks/useCreateBoard.tsx](./frontend/src/hooks/useCreateBoard.tsx)

- It removes the stakeholders from the team and returns the stakeholder back as it is

#### [enums/team.user.roles.ts](./frontend/src/utils/enums/team.user.roles.ts)

- Team User Roles: admin, member, stakeholder
