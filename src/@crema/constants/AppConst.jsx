export const authRole = {
  SuperAdmin:['superadmin'],
  Admin: ['admin'],
  User: ['user'],
  Default : ['default']
};

export const defaultUser = {
  displayName: 'John Alex',
  email: 'demo@example.com',
  token: 'access-token',
  role: 'user',
  photoURL: '/assets/images/avatar/A11.jpg',
};
export const getInitialUrlByRole = (role) => {
  switch (role) {
     case 'superadmin':
      return '/ecommerce/store-management';

    case 'admin':
      return '/ecommerce/add-products';
   
    case 'user':
      return '/home';
      
    default:
      return '/signin';
  }
};
export const allowMultiLanguage = import.meta.env.VITE__MULTILINGUAL === 'true';
export const fileStackKey = import.meta.env.VITE__FILESTACK_KEY;
export const initialUrl = import.meta.env.VITE__INITIAL_URL;
export const clientID = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID // this url will open after login

// export const baseUrl = "http://172.245.70.150:3500/v1/"
// export const mediaUrl = "http://172.245.70.150:3500/"
// export const baseUrl = "http://54.183.229.38:3502/v1/"
// export const mediaUrl = "http://54.183.229.38:3502/"

export const baseUrl = "http://localhost:3501/v1/"
export const mediaUrl = "http://localhost:3501/"



