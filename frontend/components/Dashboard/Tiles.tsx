import { styled } from "../../stitches.config";
import Box from "../Primitives/Box";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import { HeaderInfo } from "../../types/dashboard/header.info";
import Icon from "../icons/Icon";

const HeaderCard = styled(Flex, Box, {
  borderRadius: "$12",
  height: "$100",
  border: "none",
  flex: "1 1 0",
  maxWidth: "$226",
});

type TilesProps = {
  data: HeaderInfo;
};

const Tiles: React.FC<TilesProps> = ({ data }) => {
  return (
    <Flex justify="between" gap="4">
      <HeaderCard
        elevation="1"
        align="start"
        css={{
          backgroundImage: "url(images/buttons/myBoardsBG.svg)",
          zIndex: 0,
          whiteSpace: "normal",
          position: "relative",
        }}
        justify="end"
      >
        <Flex css={{ mt: "$20", ml: "$24", position: "absolute", left: 0 }} direction="column">
          <Text size="md" color="white">
            Your boards
          </Text>
          <Text heading="1" color="white">
            {data.boardsCount}
          </Text>
        </Flex>
        <Flex css={{ justifySelf: "end", alignSelf: "end", mr: "$24", mb: "$24" }}>
          <Icon name="arrow-long-right" css={{ width: "$24", height: "$24" }} />
        </Flex>
      </HeaderCard>
      <HeaderCard
        align="start"
        css={{
          backgroundImage: "url(images/buttons/myTeamsBG.svg)",
          zIndex: 0,
          whiteSpace: "normal",
          position: "relative",
        }}
        justify="end"
      >
        <Flex css={{ mt: "$20", ml: "$24", position: "absolute", left: 0 }} direction="column">
          <Text size="md" color="white">
            Your teams
          </Text>
          <Text heading="1" color="white">
            {data?.teamsCount}
          </Text>
        </Flex>
        <Flex css={{ justifySelf: "end", alignSelf: "end", mr: "$24", mb: "$24" }}>
          <Icon name="arrow-long-right" css={{ width: "$24", height: "$24" }} />
        </Flex>
      </HeaderCard>
      <HeaderCard
        align="start"
        css={{ backgroundImage: "url(images/buttons/activeMembers.svg)", position: "relative" }}
        justify="end"
      >
        <Flex css={{ mt: "$20", ml: "$24", position: "absolute", left: 0 }} direction="column">
          <Text size="md" color="white">
            Active members
          </Text>
          <Text heading="1" color="white" css={{ zIndex: 2 }}>
            {data?.usersCount}
          </Text>
        </Flex>
        <Flex css={{ justifySelf: "end", alignSelf: "end", mr: "$24", mb: "$24" }}>
          <Icon name="arrow-long-right" css={{ width: "$24", height: "$24" }} />
        </Flex>
      </HeaderCard>
    </Flex>
  );
};

export default Tiles;
