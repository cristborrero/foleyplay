// App types

export interface IPTVChannel {
  id: string;
  name: string;
  logo: string | null;
  categories: string[];
  website: string | null;
  streams: string[];
}

export interface IPTVCountry {
  code: string;
  name: string;
  flag: string;
  channels: IPTVChannel[];
}