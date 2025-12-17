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
    type?: string | null;
    supertype?: string | null;
    rarity?: string | null;
    domain?: string[] | null;
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
