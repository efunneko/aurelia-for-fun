import {ValidationRules} from 'aurelia-validation'; 

export class PhoneNumber { 
  constructor() {
    ValidationRules
      .ensure('type').required().maxLength(25)
      .ensure('number').required().maxLength(25)
      .on(this);
  } 

  static fromObject(src) { 
    return Object.assign(new PhoneNumber(), src); 
  } 
 
  type = 'Home'; 
  number = ''; 
} 
 
export class EmailAddress { 
  constructor() {
    ValidationRules
      .ensure('type').required().maxLength(25)
      .ensure('address').required().maxLength(250).email()
      .on(this);
  } 

  static fromObject(src) { 
    return Object.assign(new EmailAddress(), src); 
  } 
 
  type = 'Home'; 
  address = ''; 
} 
 
export class Address { 
  constructor() {
    ValidationRules
      .ensure('type').required().maxLength(25)
      .ensure('number').required().maxLength(100)
      .ensure('street').required().maxLength(100)
      .ensure('postalCode').required().maxLength(25)
      .ensure('city').required().maxLength(100)
      .ensure('state').maxLength(100)
      .ensure('country').required().maxLength(100)
      .on(this);
  } 

  static fromObject(src) { 
    return Object.assign(new Address(), src); 
  } 
 
  type = 'Home'; 
  number = ''; 
  street = ''; 
  postalCode = ''; 
  city = ''; 
  state = ''; 
  country = ''; 
} 
 
export class SocialProfile { 
  constructor() {
    ValidationRules
      .ensure('type').required().maxLength(25)
      .ensure('username').required().maxLength(100)
      .on(this);
  } 
 
  static fromObject(src) { 
    return Object.assign(new SocialProfile(), src); 
  } 
 
  type = 'GitHub'; 
  username = ''; 
} 
 
export class Contact { 

 constructor() {
    ValidationRules
      .ensure('firstName').maxLength(100)
      .ensure('lastName').maxLength(100)
      .ensure('company').maxLength(100)
      .ensure('birthday')
      .satisfies((value, obj) => value === null || value === undefined
                   || value === '' || !isNaN(Date.parse(value)))
        .withMessage('${$displayName} must be a valid date.')
      .ensure('note').maxLength(2000)
      .on(this);
  } 

  static fromObject(src) { 
    const contact = Object.assign(new Contact(), src); 
    contact.phoneNumbers = contact.phoneNumbers 
      .map(PhoneNumber.fromObject); 
    contact.emailAddresses = contact.emailAddresses 
      .map(EmailAddress.fromObject); 
    contact.addresses = contact.addresses 
      .map(Address.fromObject); 
    contact.socialProfiles = contact.socialProfiles 
      .map(SocialProfile.fromObject); 
    return contact; 
  } 
 
  firstName = ''; 
  lastName = ''; 
  company = ''; 
  birthday = ''; 
  phoneNumbers = []; 
  emailAddresses = []; 
  addresses = []; 
  socialProfiles = []; 
  note = ''; 

  get isPerson() { 
    return this.firstName || this.lastName; 
  } 
 
  get fullName() { 
    const fullName = this.isPerson  
      ? `${this.firstName} ${this.lastName}`  
      : this.company; 
    return fullName || ''; 
  } 

  get firstLetter() { 
    const name = this.lastName || this.firstName || this.company; 
    return name ? name[0].toUpperCase() : '?'; 
  } 

  addPhoneNumber() {
    this.phoneNumbers.push(new PhoneNumber());
  }

  addEmailAddress() { 
    this.emailAddresses.push(new EmailAddress()); 
  } 
 
  addAddress() { 
    this. addresses.push(new Address()); 
  } 
 
  addSocialProfile() { 
    this.socialProfiles.push(new SocialProfile()); 
  } 

} 
