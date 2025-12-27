package contact_api.service;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import contact_api.entity.Contact;
import contact_api.entity.Reason;
import contact_api.repo.ContactRepository;


@Service
public class ContactService {
	
	@Autowired
	private ContactRepository ContactRepositoryRef;
	
	public Collection<Contact> getAllContacts(){
		return ContactRepositoryRef.findAll();
	}
	
	public List<Contact> getContactsByReason(Reason reason) {
	    return ContactRepositoryRef.findByReason(reason);
	}
	
	
	public void createContact(Contact newContact) {
		ContactRepositoryRef.save(newContact);
	}
	
	public void deleteContact(Integer ContactId) {
		ContactRepositoryRef.deleteById(ContactId);
	}
	
	
}
