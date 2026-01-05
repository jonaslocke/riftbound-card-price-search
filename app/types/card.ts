export type Card = {
  id: string;
  name: string;
  riftbound_id: string;
  tcgplayer_id: string | null;
  ligamagic_id: string | null;
  public_code: string;
  collector_number: number;
  attributes: {
    energy: number | null;
    might: number | null;
    power: number | null;
  };
  classification: {
    type: CardType;
    supertype: CardSupertype | null;
    rarity: CardRarity;
    domain: CardDomain[];
  };
  text: {
    rich: string;
    plain: string;
  };
  set: {
    set_id: Sets;
    label: string;
  };
  media: {
    image_url: string;
    artist: string;
    accessibility_text: string;
  };
  tags: string[];
  orientation: "portrait" | "landscape";
  metadata: {
    clean_name: string;
    alternate_art: boolean;
    overnumbered: boolean;
    signature: boolean;
  };
  other_printings?: Card[];
  is_primary?: boolean;
};

export type RawCardDomain =
  | "Body"
  | "Calm"
  | "Chaos"
  | "Colorless"
  | "Fury"
  | "Mind"
  | "Order";
export type RawCardType =
  | "Battlefield"
  | "Gear"
  | "Legend"
  | "Rune"
  | "Spell"
  | "Unit";
export type RawCardSupertype = "Champion" | "Signature" | "Token" | "Basic";
export type RawCardRarity = "Common" | "Epic" | "Rare" | "Showcase" | "Uncommon";
export type CardDomain = "body" | "calm" | "chaos" | "fury" | "mind" | "order";
export type CardType =
  | "battlefield"
  | "gear"
  | "legend"
  | "rune"
  | "spell"
  | "unit";
export type CardSupertype = "champion" | "signature" | "token" | "basic";
export type CardRarity = "common" | "epic" | "rare" | "showcase" | "uncommon";
export type CardKeyword =
  | "accelerate"
  | "action"
  | "add"
  | "assault"
  | "deathknell"
  | "deflect"
  | "equip"
  | "ganking"
  | "hidden"
  | "legion"
  | "mighty"
  | "quick-draw"
  | "reaction"
  | "repeat"
  | "shield"
  | "tank"
  | "temporary"
  | "vision"
  | "weaponmaster";

export type Sets = "OGN" | "OGS" | "SFD";

export interface CardDetailsDto {
  name: string;
  imageUrl?: string;
  imageThumbnailUrl?: string;
  domains: CardDomain[];
  tags: string[];
  energy: number | null;
  power: number | null;
  might: number | null;
  type: CardType | `${CardSupertype} ${CardType}`;
  rarity: CardRarity;
  descriptionPlain: string;
  artistLabel: string;
  setLabel: string;
  cardNumber: string;
  normalizedCardNumber?: string;
  riftboundId?: string;
  isAlteredArt: boolean;
  isOverNumbered: boolean;
  isSignature: boolean;
}

export interface CardPriceStoreDto {
  storeName: string;
  storeUrl: string;
  storeTitle: string;
  storeImage: string | null;
  cardUrl: string | null;
  quantity: number;
  currentPrice: number;
  lastKnownPrice: number | null;
  currency: "brl" | "usd";
  error?: string;
}

export interface CardPricesResponseDto {
  set: string;
  number: number;
  inStockStores: number;
  stores: CardPriceStoreDto[];
  lastKnownUpdate: string | null;
  lastUpdated: string;
}
