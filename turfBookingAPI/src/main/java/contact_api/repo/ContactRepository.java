package contact_api.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import contact_api.entity.Contact;
import contact_api.entity.Reason;


public interface ContactRepository extends JpaRepository<Contact, Integer>{

	 List<Contact> findByReason(Reason reason);
}
