import CardDetailsRoot from "./CardDetailsRoot";
import CardImage from "./CardImage";
import CardDetailsPanel from "./CardDetailsPanel";
import CardTitle from "./CardTitle";
import CardMainInfo from "./CardMainInfo";
import CardTypes from "./CardTypes";
import CardDescription from "./CardDescription";
import CardNumberSet from "./CardNumberSet";
import CardIllustrator from "./CardIllustrator";
import UnitCardMight from "./UnitCardMight";

const CardDetails = Object.assign(CardDetailsRoot, {
  Image: CardImage,
  Panel: CardDetailsPanel,
  Title: CardTitle,
  MainInfo: CardMainInfo,
  Types: CardTypes,
  Description: CardDescription,
  NumberSet: CardNumberSet,
  Illustrator: CardIllustrator,
  Might: UnitCardMight,
});

export default CardDetails;
export {
  CardDetailsRoot,
  CardImage,
  CardDetailsPanel,
  CardTitle,
  CardMainInfo,
  CardTypes,
  CardDescription,
  CardNumberSet,
  CardIllustrator,
  UnitCardMight,
};
