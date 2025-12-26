export type Card = {
  id: string;
  name: string;
  riftbound_id?: string;
  tcgplayer_id?: string;
  ligamagic_id?: string | null;
  public_code?: string;
  collector_number?: number;
  attributes?: {
    energy?: number | null;
    might?: number | null;
    power?: number | null;
  };
  classification?: {
    type?: CardType | null;
    supertype?: CardSupertype | null;
    rarity?: CardRarity | null;
    domain?: CardDomain[] | null;
  };
  text?: {
    rich?: string;
    plain?: string;
  };
  set?: {
    set_id?: Sets;
    label?: string;
  };
  media?: {
    image_url?: string;
    artist?: string;
    accessibility_text?: string;
  };
  tags?: string[];
  orientation?: string;
  metadata?: {
    clean_name?: string;
    alternate_art?: boolean;
    overnumbered?: boolean;
    signature?: boolean;
  };
};

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
}

export interface CardPriceStoreDto {
  storeName: string;
  storeUrl: string;
  cardUrl: string | null;
  quantity: number;
  price: number;
  currency: "brl" | "usd";
  error?: string;
}

export interface CardPricesResponseDto {
  set: string;
  number: number;
  inStockStores: number;
  stores: CardPriceStoreDto[];
}
