import CardCost from "./components/card-details/CardCost";
import CardDescription from "./components/card-details/CardDescription";
import CardDomain from "./components/card-details/CardDomain";
import CardIllustrator from "./components/card-details/CardIllustrator";
import CardMight from "./components/card-details/CardMight";
import CardSetAndNumber from "./components/card-details/CardSetAndNumber";
import CardSuperTypes from "./components/card-details/CardSuperTypes";
import CardTitle from "./components/card-details/CardTitle";
import CardTypes from "./components/card-details/CardTypes";
import CardWrapper from "./components/card-details/CardWrapper";
import CardImage from "./components/CardImage";
import CardOtherPrintings from "./components/card-other-pritings";
import CardPreviewRoot from "./components/CardPreview";

const CardPreview = Object.assign(CardPreviewRoot, {
  Details: Object.assign(CardWrapper, {
    Cost: CardCost,
    Description: CardDescription,
    Domain: CardDomain,
    Illustrator: CardIllustrator,
    Might: CardMight,
    SetAndNumber: CardSetAndNumber,
    SuperTypes: CardSuperTypes,
    Title: CardTitle,
    Types: CardTypes,
  }),
  Image: CardImage,
  OtherPrintings: CardOtherPrintings,
});

export default CardPreview;
