export interface Contact {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  mobile_phone?: string;
  company?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Property {
  id: number;
  title?: string;
  description_note?: string;
  object_type?: string;
  rs_type?: string;
  marketing_type?: string;
  price?: number;
  living_space?: number;
  number_of_rooms?: number;
  street?: string;
  city?: string;
  postal_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  name?: string;
  title?: string;
  status?: string;
  street?: string;
  city?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Activity {
  id: number;
  title?: string;
  body?: string;
  note_type_id?: number;
  broker_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Deal {
  id: number;
  client_id?: number;
  property_id?: number;
  deal_stage_id?: number;
  price?: number;
  created_at?: string;
  updated_at?: string;
}
