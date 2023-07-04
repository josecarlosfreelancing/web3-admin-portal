import { Rol } from "./rol.model";

export interface User {
  _id?: string;
  idUsuario?: string;
  displayName?: string;
  name?: string;
  lastName?: string;
  birthDate?: any;
  email?: string;
  password?: string;
  photoURL?: string;
  photoFile?: any;
  phoneNumber?: string;
  disabled?: boolean;
  roles?: string[];
  num?: number;

  //Se agregan adicionales en el front
  accessToken?: string;
}
