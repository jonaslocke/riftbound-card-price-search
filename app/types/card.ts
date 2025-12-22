export type Card = {
  id: string;
  name: string;
  riftbound_id?: string;
  tcgplayer_id?: string;
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
    set_id?: string;
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
export type CardSupertype =
  | "champion"
  | "signature"
  | "token"
  | "basic";
export type CardRarity =
  | "common"
  | "epic"
  | "rare"
  | "showcase"
  | "uncommon";
