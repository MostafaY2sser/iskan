/**
 * SignUpType enum - Source of truth for account types
 */
export enum SignUpType {
  customer = 'customer',           // شركة / مؤسسة
  owner = 'owner',                 // مالك
  companyResidence = 'companyResidence' // وسيط عقار
}

/**
 * SignUpState interface
 */
export interface SignUpState {
  activeTabIndex: number;        // 0 = left, 1 = right
  selectedType: SignUpType;      // owner / companyResidence / customer
  stepIndex: number;             // 0..2
  agreedToTerms: boolean;
  companyData: {
    companyName: string;
    commercialRegNumber: string;
    companyType: string;
    representativeName: string;
    representativePosition: string;
    representativeIdNumber: string;
    officeAddress: string;
    city: string;
    companyPhone: string;
    mobilePhone: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}
