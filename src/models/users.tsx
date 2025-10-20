interface User {
  email: string;
  name: string;
  phone_number: string;
  password: string;
  avatar?: string;
  id?: string;
}

interface ChatroomResponse {
  id: string;
  name: string;
  desscription: string;
  is_group: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
}
