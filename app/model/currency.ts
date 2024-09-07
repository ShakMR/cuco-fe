class Currency {
  public symbol: string = "";
  public short_name: string = "";
  public full_name: string = "";
}

class EuroCurrency extends Currency {
  symbol = "€";
  short_name = "euro";
  full_name = "Euro";
}

export const Euro = new EuroCurrency();
