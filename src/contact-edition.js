import {inject, NewInstance} from 'aurelia-framework'; 
import {ContactGateway} from './contact-gateway'; 
import {Contact} from './models'; 
import {Router} from 'aurelia-router'; 
import {ValidationController} from 'aurelia-validation';

@inject(ContactGateway, NewInstance.of(ValidationController), Router) 
export class ContactEdition { 
  constructor(contactGateway, validationController, router) { 
    this.contactGateway = contactGateway; 
    this.router = router;
    this.validationController = validationController;
  } 
 
  activate(params, config) { 
    this.isNew = params.id === undefined; 
    if (this.isNew) { 
      this.contact = new Contact(); 
    } 
    else { 
      return this.contactGateway.getById(params.id).then(contact => { 
        this.contact = contact; 
        config.navModel.setTitle(contact.fullName); 
      }); 
    } 
  } 

  save() { 
    this.validationController.validate().then(errors => {
      console.log(errors);
      if (errors.length > 0) {
        return;
      }
      if (this.isNew) { 
        this.contactGateway.create(this.contact)  
        .then(() => this.router.navigateToRoute('contacts')); 
      } 
      else { 
        this.contactGateway.update(this.contact.id, this.contact)  
        .then(() => this.router.navigateToRoute('contact-details',  
          { id: this.contact.id })); 
      } 
    }); 

  } 

} 
