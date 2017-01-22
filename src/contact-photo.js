import {inject} from 'aurelia-framework'; 
import {Router} from 'aurelia-router'; 
import {ContactGateway} from './contact-gateway'; 
 
@inject(ContactGateway, Router) 
export class ContactPhoto { 
   
  constructor(contactGateway, router) { 
    this.contactGateway = contactGateway; 
    this.router = router; 
  } 
 
  activate(params, config) { 
    return this.contactGateway.getById(params.id).then(contact => { 
      this.contact = contact; 
      config.navModel.setTitle(this.contact.fullName); 
    }); 
  } 
  save() { 
    if (this.photo && this.photo.length > 0) { 
      this.contactGateway.updatePhoto( 
        this.contact.id,  
        this.photo.item(0) 
      ).then(() => { 
        this.router.navigateToRoute( 
          'contact-details',  
          { id: this.contact.id }); 
      }); 
    } 
  } 
} 
