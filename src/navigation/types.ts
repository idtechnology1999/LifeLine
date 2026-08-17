export type AuthMode = 'login' | 'signup';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainPage: undefined;
  Auth: { mode?: AuthMode } | undefined;
  OtpVerification: {
    phone: string;
    mode: AuthMode;
    name?: string;
    email?: string;
  };
  RequesterHome: undefined;
  DriverHome: undefined;
  DispatcherHome: undefined;
  Home: undefined;
};
