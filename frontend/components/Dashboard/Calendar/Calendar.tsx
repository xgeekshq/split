/* eslint-disable react/jsx-no-bind */
import { CalendarTileProperties } from "react-calendar";
import { useState } from "react";
import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import NoMeetingsImage from "../../images/NoMeetings";
import StyledCalendar from "./StyledCalendar";
import Icon from "../../icons/Icon";

const StyledContainer = styled(Flex, {
  height: "100%",
  maxWidth: "364px",
  backgroundColor: "$white",
  px: "$32",
  pt: "$76",
});

const StyledNoMeetings = styled(NoMeetingsImage, { mx: "78px" });

const CalendarBar = () => {
  const [currentValue, setOnChange] = useState<Date | null>(new Date());
  const hasMeetings = true;
  const handleOnChange = (date: Date) => {
    if (date.getTime() !== currentValue?.getTime()) {
      setOnChange(date);
      return;
    }
    setOnChange(null);
  };

  function tileContent(props: CalendarTileProperties) {
    const { view } = props;
    if (view === "month") {
      return (
        <Flex css={{ justifyContent: "center", size: "6", gridRowStart: "3" }}>
          {/* <Dot /> */}
          {/* <TwoDots /> */}
          {/* <ThreeDots /> */}
          {/* <MoreDots /> */}
        </Flex>
      );
    }
    return null;
  }

  return (
    <StyledContainer direction="column">
      <Text css={{ mb: "$40" }} heading="4">
        Upcoming
      </Text>
      {!hasMeetings && (
        <Flex
          justify="center"
          align="center"
          direction="column"
          css={{ mt: "$40", textAlign: "center" }}
          gap="24"
        >
          <StyledNoMeetings />
          <Text size="md" color="primary400" css={{ mx: "$41" }}>
            Your have no upcoming <br /> retrospectives any time soon.
          </Text>
        </Flex>
      )}
      {hasMeetings && (
        <StyledCalendar
          formatShortWeekday={(locale: string, date: Date) =>
            ["Su", "Mo", "Th", "We", "Th", "Fr", "Sa"][date.getDay()]
          }
          minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
          nextLabel={<Icon name="arrow-right" />}
          prevLabel={<Icon name="arrow-left" />}
          onChange={handleOnChange}
          value={currentValue}
          minDetail="year"
          tileContent={tileContent}
        />
      )}
    </StyledContainer>
  );
};
export default CalendarBar;
