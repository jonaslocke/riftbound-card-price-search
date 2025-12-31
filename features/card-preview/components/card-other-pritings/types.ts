export type PrintIndicator = "altered" | "overnumbered" | "signature";

export interface OtherPrintTile {
  href: string;
  image_url?: string | undefined;
  name: string;
  public_code?: string | undefined;
  isSelected?: boolean;
  isAlteredArt: boolean | undefined;
  isSignature: boolean | undefined;
  isOverNumbered: boolean | undefined;
}
