import {inject} from 'aurelia-framework'; 
import {ContactGateway} from './contact-gateway'; 
 
@inject(ContactGateway) 
export class ContactDetails { 
  constructor(contactGateway) { 
    this.contactGateway = contactGateway; 
  } 
 
  activate(params, config) { 
    return this.contactGateway.getById(params.id) 
      .then(contact => { 
        this.contact = contact; 
        config.navModel.setTitle(contact.fullName); 
      }); 
  } 

  tryDelete() { 
    if (confirm('Do you want to delete this contact?')) { 
      this.contactGateway.delete(this.contact.id) 
        .then(() => { this.router.navigateToRoute('contacts'); }); 
    } 
  } 
  
} 
