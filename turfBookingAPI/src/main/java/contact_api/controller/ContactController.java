package contact_api.controller;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import contact_api.*;
import contact_api.entity.Contact;
import contact_api.entity.Reason;
import contact_api.service.ContactService;

@CrossOrigin
@RestController
public class ContactController {
	
	@Autowired
	private ContactService ContactServiceRef;
	@GetMapping("/contacts")
	public Collection<Contact> getAllContacts(){
		return ContactServiceRef.getAllContacts();
	}
	
	@GetMapping("/contacts/{reason}")
    public List<Contact> getContactsByReason(@PathVariable Reason reason) {
        return ContactServiceRef.getContactsByReason(reason);
    }
	
	@PostMapping("/contacts")
    public String createContact(@RequestBody Contact newContact) {
		ContactServiceRef.createContact(newContact);
        return "Contact created successfully!";
    }
   
    
    @DeleteMapping("/contacts/{ContactId}")
    public String deleteContact(@PathVariable Integer ContactId) {
    	ContactServiceRef.deleteContact(ContactId);
        return "Contact deleted successfully!";
    }
}
