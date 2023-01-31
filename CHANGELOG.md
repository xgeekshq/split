# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased](https://github.com/xgeekshq/split/compare/v0.1.5...HEAD)

## [v0.1.5](https://github.com/xgeekshq/split/compare/v0.1.4...v0.1.5) - 2023-01-30

### What Changed 👀

### 🐛 Bug Fixes

- fix: settings in a split board @nunocaseiro (#955)
- feat: text primitive story \& fixes @StereoPT (#953)
- fix: button primitive component normalization @JoaoSaIvador (#949)

## 📄 Documentation

- feat: text primitive story \& fixes @StereoPT (#953)

## [v0.1.4](https://github.com/xgeekshq/split/compare/v0.1.3...v0.1.4) - 2023-01-27

### What Changed 👀

### 🐛 Bug Fixes

- fix: use unique name or email to add a user into slack main channel @nunocaseiro (#952)

## [v0.1.3](https://github.com/xgeekshq/split/compare/v0.1.2...v0.1.3) - 2023-01-27

### What Changed 👀

### 🚀 Features

- refactor: protect team names duplication @nunocaseiro (#951)

## [v0.1.2](https://github.com/xgeekshq/split/compare/v0.1.1...v0.1.2) - 2023-01-27

### What Changed 👀

- feat: add user to main channel; fix deleted user issues @nunocaseiro (#947)
- refactor: disable regular board creation @nunocaseiro (#933)
- feat: column operations actions @CatiaAntunes96 (#891)
- fix: 877 bug create new team page design @StereoPT (#878)
- refactor: sockets @nunocaseiro (#864)
- docs: add JoaoSaIvador as a contributor for code, and doc @allcontributors (#849)
- docs: add StereoPT as a contributor for code @allcontributors (#848)
- refactor: reduce number of requests using sockets @rpvsilva (#837)
- feat: design select on selecting teams @patricia-mdias (#797)
- fix: votes @nunocaseiro (#795)
- refactor: board issues  @nunocaseiro (#779)
- refactor: create generic dialog @rpvsilva (#762)
- fix: debounce increased from 100ms to 300ms @GuiSanto (#767)
- feat: fetch teams, add teams to user, filter by search @GuiSanto (#759)
- feat: add teams to user (create teamuser db documents) @GuiSanto (#758)
- feat: get teams the user is not part of @GuiSanto (#754)
- feat: displaying all teams of user. Delete team of user too @GuiSanto (#729)
- feat: get teams of user backend refactored @GuiSanto (#728)
- refactor: board settings, update packages @nunocaseiro (#713)
- refactor: removed local dockerfiles and changed docker compose @rpvsilva (#701)
- fix: optimistic update on anonymous comments  @nunocaseiro (#698)
- feat: team repository @nunocaseiro (#661)
- feat: super admin allowed to change teams @patricia-mdias (#654)

### 🚀 Features

- feat: regular board add remove edit move board columns @patricia-mdias (#940)
- feat: flex story @StereoPT (#939)
- feat: storybook @StereoPT (#935)
- feat: regular board add remove edit move board columns @patricia-mdias (#929)
- feat: add archive service @mourabraz (#822)
- feat: column operations action frontend @CatiaAntunes96 (#919)
- feat: make board public ui @patricia-mdias (#892)
- feat: column operation popover @CatiaAntunes96 (#880)
- fix: dashboard links @CatiaAntunes96 (#873)
- feat: regular board list board users @patricia-mdias (#863)
- feat: personal boards page @patricia-mdias (#857)
- feat: personal filter boads page frontend @patricia-mdias (#824)
- feat: personal filter boads page endpoint @patricia-mdias (#805)
- refactor: landing page @nunocaseiro (#809)
- feat: add empty regular board @CatiaAntunes96 (#793)
- feat: create regular board action frontend @CatiaAntunes96 (#786)
- feat: filter boards by team fe @patricia-mdias (#783)
- feat: configurations tab @CatiaAntunes96 (#774)
- feat: participants tab select participants @CatiaAntunes96 (#772)
- feat: add select team to regular board @CatiaAntunes96 (#736)
- feat: filter boards by team endpoint @patricia-mdias (#760)
- feat: superadmin gets all the teams @patricia-mdias (#753)
- feat: layout complete @GuiSanto (#751)
- feat: edit role of user of corresponding team when editing user @RafaelSBatista97 (#744)
- feat: layout of teams of the user when editing the user @RafaelSBatista97 (#724)
- feat: top layout for users edit page @RafaelSBatista97 (#718)
- feat: team card body @patricia-mdias (#702)
- feat: frontend done for search user @GuiSanto (#707)
- feat: backend done for search user @GuiSanto (#705)
- feat: select all team members button @patricia-mdias (#673)
- feat: configure regular board @CatiaAntunes96 (#685)
- feat: delete user @GuiSanto (#665)
- feat: update team members @patricia-mdias (#668)
- feat: users lazy loading scroll @RafaelSBatista97 (#683)
- feat: users lazy loading backend @RafaelSBatista97 (#682)
- feat: select retro type @CatiaAntunes96 (#681)
- refactor: handle disable vote buttons @nunocaseiro (#684)
- feat: change team on create board @CatiaAntunes96 (#667)
- feat: user card actions @RafaelSBatista97 (#658)
- feat: automatically update isnewjoiner status @CatiaAntunes96 (#662)
- feat: update team members endpoint @patricia-mdias (#666)
- feat: user repository @nunocaseiro (#655)
- feat: user card on the list @GuiSanto (#649)
- feat: add delete team endpoint ui @patricia-mdias (#637)
- feat: add delete team endpoint @patricia-mdias (#633)
- feat(teams): added endpoint to get users with corresponding teams @RafaelSBatista97 (#632)

### 🐛 Bug Fixes

- fix: missing socket send room @nunocaseiro (#943)
- fix: set check value only on slackEnable @JoaoSaIvador (#948)
- fix: package-lock sync @JoaoSaIvador (#938)
- fix: add alert button and disabled select color @JoaoSaIvador (#930)
- fix: scrollable containers margins @StereoPT (#927)
- fix: verify checkbox id @JoaoSaIvador (#925)
- fix: slack participants and votes @nunocaseiro (#913)
- fix: enableSlack with hook form and fix form submissions @nunocaseiro (#923)
- fix: new split board page scroll @JoaoSaIvador (#921)
- fix: removed decimal part @StereoPT (#920)
- fix: split instead of splitted @StereoPT (#916)
- fix: store state on create slack group checkbox @JoaoSaIvador (#911)
- fix: super-admin access @StereoPT (#906)
- fix: font weight board settings and add new card buttons @StereoPT (#910)
- fix: card settings background color @JoaoSaIvador (#908)
- fix: unify scrolling behavior on create new x pages @JoaoSaIvador (#905)
- fix: card amount background color @StereoPT (#907)
- fix: new split board team selection @StereoPT (#898)
- fix: bug login page design and bugs @JoaoSaIvador (#893)
- fix: last updated dates not showing in boards list page @JoaoSaIvador (#897)
- fix: regular board update board name @patricia-mdias (#879)
- fix: search input clear and colors @JoaoSaIvador (#876)
- fix: bug new board design fixes @JoaoSaIvador (#889)
- fix: gap between team-rows @StereoPT (#884)
- fix: participants can be added to Regular board @patricia-mdias (#888)
- fix: bug drop down design @StereoPT (#872)
- fix: bug distances between the board rows @JoaoSaIvador (#868)
- fix: bug sub board configurations @JoaoSaIvador (#856)
- fix: only allow team admins to add new team boards @JoaoSaIvador (#862)
- fix: team admin stakeholder cant access sub boards @StereoPT (#860)
- fix: registered users amount @StereoPT (#855)
- fix: board loading @CatiaAntunes96 (#853)
- fix: votes @nunocaseiro (#851)
- fix: schedules and votes @nunocaseiro (#847)
- fix: team members list ordering @StereoPT (#841)
- fix: verifyNewJoiner function in backend @patricia-mdias (#843)
- fix: unmerge, avoid requesting on success, handle erros @nunocaseiro (#836)
- fix: users distributed evenly per sub board @patricia-mdias (#839)
- fix: main board alert section padding @JoaoSaIvador (#834)
- fix: validation text area on change @nunocaseiro (#828)
- fix: update card position and votes with sockets @nunocaseiro (#827)
- fix: text area new line and height @nunocaseiro (#826)
- fix: bug names @RafaelSBatista97 (#823)
- fix: board access and other fixes @nunocaseiro (#818)
- fix: add slack enable in the sub boards @nunocaseiro (#820)
- fix: padding of stakeholders box when creating board @RafaelSBatista97 (#814)
- fix: fix newJoiner status, responsible of subBoard @CatiaAntunes96 (#807)
- fix: comment sort by date, create anonymous comments in card group @nunocaseiro (#804)
- fix: some bugs @nunocaseiro (#802)
- fix: votes and responsibles @nunocaseiro (#796)
- fix: fix add responsibles field to boardData @CatiaAntunes96 (#799)
- fix: votes @nunocaseiro (#787)
- fix: random responsible generator fixed @GuiSanto (#789)
- fix: multiple bugs @RafaelSBatista97 (#784)
- fix: get user info @RafaelSBatista97 (#771)
- fix: only makes request when the dialog is opened @RafaelSBatista97 (#764)
- fix: large names @nunocaseiro (#768)
- fix: user edit role working @GuiSanto (#761)
- fix(signUp): rerenders on register form @rpvsilva (#755)
- feat: superadmin gets all the teams @patricia-mdias (#753)
- fix: new board shows team selected on 1st render @patricia-mdias (#746)
- fix: users edit teams list and delete users @RafaelSBatista97 (#735)
- fix: bugs @nunocaseiro (#727)
- fix: fix split of teams by sub-board @CatiaAntunes96 (#730)
- fix: settings tab removes sub boards @CatiaAntunes96 (#725)
- fix: voting updates @nunocaseiro (#711)
- fix: merge card position @nunocaseiro (#709)
- fix: scroll in a board and drag and drop cards when the columns are sorted @nunocaseiro (#704)
- feat: select all team members button @patricia-mdias (#673)
- fix: unmerge cards positions @nunocaseiro (#700)
- fix: large cards @nunocaseiro (#696)
- fix: request new access token with refresh token @nunocaseiro (#695)
- fix: large cards @nunocaseiro (#659)
- fix: delete team removes associated boards @patricia-mdias (#653)
- fix: issues @nunocaseiro (#648)
- fix: unauthorised error on dashboard @nunocaseiro (#647)
- fix: fetchData method return @nunocaseiro (#640)
- fix: team cards @patricia-mdias (#626)
- fix: npm prod script command @nunocaseiro (#635)

### 📄 Documentation

- feat: flex story @StereoPT (#939)
- feat: storybook @StereoPT (#935)

### 🧩 Dependency Updates

<details>
<summary>14 changes</summary>
- chore(deps): bump luxon from 1.28.0 to 1.28.1 in /backend @dependabot (#944)
- chore(deps): bump cookiejar from 2.1.3 to 2.1.4 in /backend @dependabot (#932)
- chore: update react query @nunocaseiro (#867)
- chore(deps-dev): bump @commitlint/cli from 17.3.0 to 17.4.0 @dependabot (#830)
- chore(deps): bump json5 from 1.0.1 to 1.0.2 in /frontend @dependabot (#829)
- chore(deps-dev): bump @commitlint/config-conventional from 17.3.0 to 17.4.0 @dependabot (#831)
- chore: update jwt packages @rpvsilva (#769)
- chore(deps): bump qs and formidable in /backend @dependabot (#664)
- chore(deps): bump decode-uri-component from 0.2.0 to 0.2.2 in /frontend @dependabot (#657)
- chore(deps-dev): bump @commitlint/cli from 17.1.2 to 17.3.0 @dependabot (#645)
- chore(deps-dev): bump @commitlint/config-conventional from 17.1.0 to 17.3.0 @dependabot (#644)
- chore(deps-dev): bump concurrently from 7.3.0 to 7.6.0 @dependabot (#643)
- chore(deps): bump amannn/action-semantic-pull-request from 4.5.0 to 5.0.2 @dependabot (#642)
- chore(deps): bump actions/setup-node from 2 to 3 @dependabot (#641)

</details>
**Full Changelog**: https://github.com/xgeekshq/split/compare/v0.1.1...v0.1.2
