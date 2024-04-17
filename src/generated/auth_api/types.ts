/* eslint-disable */
/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */
export type Maybe<T> = T;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  CountryCode: { input: any; output: any };
  /** ISO8601 formatted date (yyyy-mm-dd) */
  Date: { input: any; output: any };
  EmailAddress: { input: any; output: any };
};

export enum MfaDeliveryMethod {
  AUTH_APP = 'AUTH_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export type MfaInfo = {
  __typename: 'MfaInfo';
  backupSetupRequired: Scalars['Boolean']['output'];
  /** User's country code */
  defaultCountryCode: Scalars['CountryCode']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** Flag to indicate if user could setup MFA now. */
  readyForSetup: Scalars['Boolean']['output'];
  setupRequiredFrom?: Maybe<Scalars['Date']['output']>;
  /** Flag to indicate if user is still in MFA setup grace period. */
  setupSkippable: Scalars['Boolean']['output'];
  sources: Array<MfaSource>;
};

export type MfaSource = {
  __typename: 'MfaSource';
  contact?: Maybe<Scalars['String']['output']>;
  deliveryMethod: MfaDeliveryMethod;
  id: Scalars['ID']['output'];
  type?: Maybe<MfaSourceTypeEnum>;
};

export enum MfaSourceTypeEnum {
  BACKUP = 'BACKUP',
  PRIMARY = 'PRIMARY',
}

export type Mutation = {
  __typename: 'Mutation';
  /** Confirm user with confirmation token */
  userConfirm?: Maybe<UserConfirmPayload>;
  /** Accept user invitation with invitation token. Sign in user and generate user's access token */
  userInvitationAccept?: Maybe<UserInvitationAcceptPayload>;
  /** Sign in user with rails session and generate user's access token */
  userLogin?: Maybe<UserLoginPayload>;
  /**
   * Sign in user with one time password when multi-factor authentication(mfa) is
   * enabled for the user. It requires user token with mfa scope to execute the mutation.
   */
  userLoginWithOneTimePassword?: Maybe<UserLoginWithOneTimePasswordPayload>;
  /** Sign in user with rails session and generate user's access token */
  userLoginWithOneTimeToken?: Maybe<UserLoginWithOneTimeTokenPayload>;
  /**
   * Send one time password to user's multi-factor authentication(mfa) backup
   * method(email or sms). It requires user token with mfa scope to execute the mutation
   */
  userMfaBackupSourceSetup?: Maybe<UserMfaBackupSourceSetupPayload>;
  /**
   * Validate one time password and then set user's multi-factor
   * authentication(mfa) backup method(email or sms). It requires user token with
   * mfa scope to execute the mutation.
   */
  userMfaBackupSourceVerify?: Maybe<UserMfaBackupSourceVerifyPayload>;
  /** Enable multi-factor authentication(mfa) for current user. It requires user token with mfa scope to execute the mutation. */
  userMfaEnable?: Maybe<UserMfaEnablePayload>;
  /** Send one time password to current user's saved mfa method(primary/backup). It requires mfa scope to execute the mutation. */
  userMfaOneTimePasswordRequest?: Maybe<UserMfaOneTimePasswordRequestPayload>;
  /**
   * Send one time password to user's multi-factor authentication(mfa) primary
   * method(auth app or sms). It requires user token mfa scope to execute the mutation.
   */
  userMfaPrimarySourceSetup?: Maybe<UserMfaPrimarySourceSetupPayload>;
  /**
   * Validate one time password and then set user's multi-factor
   * authentication(mfa) primary method(auth app or sms). It requires user token
   * mfa scope to execute the mutation.
   */
  userMfaPrimarySourceVerify?: Maybe<UserMfaPrimarySourceVerifyPayload>;
  /** Send resetting password instructions to user's email. */
  userPasswordResetSend?: Maybe<UserPasswordResetSendPayload>;
  /** Validate user's resetting password token and generate user token. */
  userPasswordResetVerify?: Maybe<UserPasswordResetVerifyPayload>;
  /**
   * Update user's password when a valid one time password is provided, then sign
   * in user and generate user token. It requires user token with reset_password
   * scope to execute the mutation.
   */
  userPasswordUpdateAfterReset?: Maybe<UserPasswordUpdateAfterResetPayload>;
  userRefreshToken?: Maybe<UserRefreshTokenPayload>;
  /** Finish SingleSignOn signup, consume one time token and create practice with user from the social login. */
  userRegisterWithSingleSignOn?: Maybe<UserRegisterWithSingleSignOnPayload>;
  /** Create user with given email and password. */
  userRegistration?: Maybe<UserRegistrationPayload>;
};

export type MutationUserConfirmArgs = {
  input: UserConfirmInput;
};

export type MutationUserInvitationAcceptArgs = {
  input: UserInvitationAcceptInput;
};

export type MutationUserLoginArgs = {
  input: UserLoginInput;
};

export type MutationUserLoginWithOneTimePasswordArgs = {
  input: UserLoginWithOneTimePasswordInput;
};

export type MutationUserLoginWithOneTimeTokenArgs = {
  input: UserLoginWithOneTimeTokenInput;
};

export type MutationUserMfaBackupSourceSetupArgs = {
  input: UserMfaBackupSourceSetupInput;
};

export type MutationUserMfaBackupSourceVerifyArgs = {
  input: UserMfaBackupSourceVerifyInput;
};

export type MutationUserMfaEnableArgs = {
  input: UserMfaEnableInput;
};

export type MutationUserMfaOneTimePasswordRequestArgs = {
  input: UserMfaOneTimePasswordRequestInput;
};

export type MutationUserMfaPrimarySourceSetupArgs = {
  input: UserMfaPrimarySourceSetupInput;
};

export type MutationUserMfaPrimarySourceVerifyArgs = {
  input: UserMfaPrimarySourceVerifyInput;
};

export type MutationUserPasswordResetSendArgs = {
  input: UserPasswordResetSendInput;
};

export type MutationUserPasswordResetVerifyArgs = {
  input: UserPasswordResetVerifyInput;
};

export type MutationUserPasswordUpdateAfterResetArgs = {
  input: UserPasswordUpdateAfterResetInput;
};

export type MutationUserRefreshTokenArgs = {
  input: UserRefreshTokenInput;
};

export type MutationUserRegisterWithSingleSignOnArgs = {
  input: UserRegisterWithSingleSignOnInput;
};

export type MutationUserRegistrationArgs = {
  input: UserRegistrationInput;
};

export type Query = {
  __typename: 'Query';
  codeVersion: Scalars['String']['output'];
  environment: Scalars['String']['output'];
  /** Minimum password strength score */
  passwordStrengthMinimumScore: Scalars['Int']['output'];
  /** Checks the strength score of the given password */
  passwordStrengthScore: Scalars['Int']['output'];
  /** Strong password strength score */
  passwordStrengthStrongScore: Scalars['Int']['output'];
};

export type QueryPasswordStrengthScoreArgs = {
  password: Scalars['String']['input'];
};

/** Autogenerated input type of UserConfirm */
export type UserConfirmInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  confirmationToken: Scalars['String']['input'];
};

/** Autogenerated return type of UserConfirm. */
export type UserConfirmPayload = {
  __typename: 'UserConfirmPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of UserInvitationAccept */
export type UserInvitationAcceptInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  invitationToken: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** Autogenerated return type of UserInvitationAccept. */
export type UserInvitationAcceptPayload = {
  __typename: 'UserInvitationAcceptPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mfaInfo?: Maybe<MfaInfo>;
};

/** Autogenerated input type of UserLogin */
export type UserLoginInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['EmailAddress']['input'];
  password: Scalars['String']['input'];
  rememberMeToken?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated return type of UserLogin. */
export type UserLoginPayload = {
  __typename: 'UserLoginPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mfaInfo?: Maybe<MfaInfo>;
  oneTimePasswordRequired?: Maybe<Scalars['Boolean']['output']>;
};

/** Autogenerated input type of UserLoginWithOneTimePassword */
export type UserLoginWithOneTimePasswordInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  oneTimePassword: Scalars['String']['input'];
  /** Flag to control whether to generate user mfa remember me token. */
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Autogenerated return type of UserLoginWithOneTimePassword. */
export type UserLoginWithOneTimePasswordPayload = {
  __typename: 'UserLoginWithOneTimePasswordPayload';
  accessToken: Scalars['String']['output'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  rememberMeToken?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of UserLoginWithOneTimeToken */
export type UserLoginWithOneTimeTokenInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  oneTimeToken: Scalars['String']['input'];
};

/** Autogenerated return type of UserLoginWithOneTimeToken. */
export type UserLoginWithOneTimeTokenPayload = {
  __typename: 'UserLoginWithOneTimeTokenPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of UserMfaBackupSourceSetup */
export type UserMfaBackupSourceSetupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<Scalars['String']['input']>;
  deliveryMethod: MfaDeliveryMethod;
};

/** Autogenerated return type of UserMfaBackupSourceSetup. */
export type UserMfaBackupSourceSetupPayload = {
  __typename: 'UserMfaBackupSourceSetupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mfaInfo?: Maybe<MfaInfo>;
};

/** Autogenerated input type of UserMfaBackupSourceVerify */
export type UserMfaBackupSourceVerifyInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  contact: Scalars['String']['input'];
  deliveryMethod: MfaDeliveryMethod;
  oneTimePassword: Scalars['String']['input'];
};

/** Autogenerated return type of UserMfaBackupSourceVerify. */
export type UserMfaBackupSourceVerifyPayload = {
  __typename: 'UserMfaBackupSourceVerifyPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mfaInfo?: Maybe<MfaInfo>;
};

/** Autogenerated input type of UserMfaEnable */
export type UserMfaEnableInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated return type of UserMfaEnable. */
export type UserMfaEnablePayload = {
  __typename: 'UserMfaEnablePayload';
  accessToken: Scalars['String']['output'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mfaInfo: MfaInfo;
};

/** Autogenerated input type of UserMfaOneTimePasswordRequest */
export type UserMfaOneTimePasswordRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  viaBackup: Scalars['Boolean']['input'];
};

/** Autogenerated return type of UserMfaOneTimePasswordRequest. */
export type UserMfaOneTimePasswordRequestPayload = {
  __typename: 'UserMfaOneTimePasswordRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mfaInfo: MfaInfo;
};

/** Autogenerated input type of UserMfaPrimarySourceSetup */
export type UserMfaPrimarySourceSetupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<Scalars['String']['input']>;
  deliveryMethod: MfaDeliveryMethod;
};

/** Autogenerated return type of UserMfaPrimarySourceSetup. */
export type UserMfaPrimarySourceSetupPayload = {
  __typename: 'UserMfaPrimarySourceSetupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mfaInfo: MfaInfo;
  /** Code which may be copied to the authenticator app in leau of scanning the QR code. */
  mfaProvisioningCode: Scalars['String']['output'];
  mfaProvisioningUri: Scalars['String']['output'];
};

/** Autogenerated input type of UserMfaPrimarySourceVerify */
export type UserMfaPrimarySourceVerifyInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<Scalars['String']['input']>;
  deliveryMethod: MfaDeliveryMethod;
  oneTimePassword: Scalars['String']['input'];
};

/** Autogenerated return type of UserMfaPrimarySourceVerify. */
export type UserMfaPrimarySourceVerifyPayload = {
  __typename: 'UserMfaPrimarySourceVerifyPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mfaInfo?: Maybe<MfaInfo>;
};

/** Autogenerated input type of UserPasswordResetSend */
export type UserPasswordResetSendInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['EmailAddress']['input'];
};

/** Autogenerated return type of UserPasswordResetSend. */
export type UserPasswordResetSendPayload = {
  __typename: 'UserPasswordResetSendPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of UserPasswordResetVerify */
export type UserPasswordResetVerifyInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  resetPasswordToken: Scalars['String']['input'];
};

/** Autogenerated return type of UserPasswordResetVerify. */
export type UserPasswordResetVerifyPayload = {
  __typename: 'UserPasswordResetVerifyPayload';
  accessToken: Scalars['String']['output'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mfaInfo: MfaInfo;
};

/** Autogenerated input type of UserPasswordUpdateAfterReset */
export type UserPasswordUpdateAfterResetInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  oneTimePassword?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

/** Autogenerated return type of UserPasswordUpdateAfterReset. */
export type UserPasswordUpdateAfterResetPayload = {
  __typename: 'UserPasswordUpdateAfterResetPayload';
  accessToken: Scalars['String']['output'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of UserRefreshToken */
export type UserRefreshTokenInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated return type of UserRefreshToken. */
export type UserRefreshTokenPayload = {
  __typename: 'UserRefreshTokenPayload';
  accessToken: Scalars['String']['output'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of UserRegisterWithSingleSignOn */
export type UserRegisterWithSingleSignOnInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  oneTimeToken: Scalars['String']['input'];
};

/** Autogenerated return type of UserRegisterWithSingleSignOn. */
export type UserRegisterWithSingleSignOnPayload = {
  __typename: 'UserRegisterWithSingleSignOnPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of UserRegistration */
export type UserRegistrationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['EmailAddress']['input'];
  password: Scalars['String']['input'];
  referralCode?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated return type of UserRegistration. */
export type UserRegistrationPayload = {
  __typename: 'UserRegistrationPayload';
  accessToken: Scalars['String']['output'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UserLoginMutationVariables = Exact<{
  email: Scalars['EmailAddress']['input'];
}>;

export type UserLoginMutation = {
  __typename: 'Mutation';
  userLogin?: {
    __typename: 'UserLoginPayload';
    accessToken?: string;
    oneTimePasswordRequired?: boolean;
    mfaInfo?: {
      __typename: 'MfaInfo';
      id: string;
      enabled: boolean;
      readyForSetup: boolean;
      setupSkippable: boolean;
      setupRequiredFrom?: any;
      sources: Array<{
        __typename: 'MfaSource';
        deliveryMethod: MfaDeliveryMethod;
      }>;
    };
  };
};
